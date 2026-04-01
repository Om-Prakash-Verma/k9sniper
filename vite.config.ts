import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'lucide-vendor': ['lucide-react'],
            'motion-vendor': ['motion/react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' https://checkout.razorpay.com https://cdn.razorpay.com https://www.gstatic.com https://apis.google.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://picsum.photos https://images.unsplash.com https://*.googleusercontent.com https://www.gstatic.com https://cdn.fynd.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.razorpay.com https://lumberjack.razorpay.com; frame-src 'self' https://api.razorpay.com https://*.firebaseapp.com https://*.google.com; base-uri 'self'; form-action 'self';",
        'Permissions-Policy': 'accelerometer=(self), camera=(self), microphone=(self), geolocation=(self)',
        'Access-Control-Expose-Headers': 'x-rtb-fingerprint-id, request-id',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
  };
});
