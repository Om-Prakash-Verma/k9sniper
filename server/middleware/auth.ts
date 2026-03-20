import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../../src/lib/firebase-admin';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
    ip?: string;
    userAgent?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies.session || '';

  if (!sessionCookie) {
    return res.status(401).json({ error: 'Unauthorized: No session cookie' });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Session Binding: Check IP and User-Agent
    const currentIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const currentUserAgent = req.headers['user-agent'];

    if (decodedClaims.ip && decodedClaims.ip !== currentIp) {
      logger.security('Session IP mismatch', { uid: decodedClaims.uid, expected: decodedClaims.ip, actual: currentIp });
      return res.status(401).json({ error: 'Session binding failed: IP mismatch' });
    }

    if (decodedClaims.userAgent && decodedClaims.userAgent !== currentUserAgent) {
      logger.security('Session User-Agent mismatch', { uid: decodedClaims.uid, expected: decodedClaims.userAgent, actual: currentUserAgent });
      return res.status(401).json({ error: 'Session binding failed: User-Agent mismatch' });
    }

    const isAdmin = decodedClaims.role === 'admin' || (decodedClaims.email === 'webapp1.in@gmail.com' && decodedClaims.email_verified === true);

    req.user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: isAdmin ? 'admin' : 'user',
      ip: decodedClaims.ip,
      userAgent: decodedClaims.userAgent,
    };
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message });
    res.clearCookie('session');
    res.status(401).json({ error: 'Unauthorized: Invalid session' });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    logger.security('Admin access denied', { uid: req.user?.uid, role: req.user?.role });
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

export const rotateSession = async (req: AuthRequest, res: Response, idToken: string) => {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const currentIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const currentUserAgent = req.headers['user-agent'];

    // Verify ID Token and get existing claims
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Set custom claims for binding and role if not already set
    // In a real app, you'd fetch the role from DB once and set it
    // For now, we'll check if it's the admin email provided in context
    const isAdmin = decodedToken.email === 'webapp1.in@gmail.com';
    
    await adminAuth.setCustomUserClaims(decodedToken.uid, {
      role: isAdmin ? 'admin' : 'user',
      ip: currentIp,
      userAgent: currentUserAgent,
    });

    // Create session cookie with binding info
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
    };

    res.cookie('session', sessionCookie, options);
    logger.info('Session rotated/created', { uid: decodedToken.uid, ip: currentIp, role: isAdmin ? 'admin' : 'user' });
  } catch (error) {
    logger.error('Session rotation failed', { error: (error as Error).message });
    throw error;
  }
};
