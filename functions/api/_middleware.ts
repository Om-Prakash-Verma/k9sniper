export const onRequest: PagesFunction = async ({ next }) => {
  const response = await next();
  
  const csp = "default-src 'self'; script-src 'self' https://checkout.razorpay.com https://cdn.razorpay.com https://www.gstatic.com https://apis.google.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://picsum.photos https://images.unsplash.com https://*.googleusercontent.com https://www.gstatic.com https://cdn.fynd.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.razorpay.com https://lumberjack.razorpay.com; frame-src 'self' https://api.razorpay.com https://*.firebaseapp.com https://*.google.com; base-uri 'self'; form-action 'self';";

  // Security Headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Permissions-Policy", "accelerometer=*, camera=(self), microphone=(self), geolocation=(self)");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  response.headers.set("Access-Control-Expose-Headers", "x-rtb-fingerprint-id, request-id");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-rtb-fingerprint-id, request-id");
  
  return response;
};
