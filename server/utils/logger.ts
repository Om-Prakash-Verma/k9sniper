import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

export const logger = {
  log(level: LogLevel, message: string, context?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context),
    };

    const logString = JSON.stringify(entry) + '\n';
    
    // Log to console
    if (level === LogLevel.ERROR || level === LogLevel.SECURITY) {
      console.error(logString);
    } else {
      console.log(logString);
    }

    // Log to file (optional, for persistence)
    try {
      fs.appendFileSync(path.join(LOG_DIR, 'app.log'), logString);
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  },

  info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context);
  },

  warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context);
  },

  error(message: string, context?: any) {
    this.log(LogLevel.ERROR, message, context);
  },

  security(message: string, context?: any) {
    this.log(LogLevel.SECURITY, message, context);
  },

  sanitizeContext(context: any) {
    if (!context) return undefined;
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'cvv', 'card'];
    
    const sanitize = (obj: any) => {
      for (const key in obj) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
          obj[key] = '********';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };

    sanitize(sanitized);
    return sanitized;
  }
};
