export const onRequest: PagesFunction = async ({ next }) => {
  const response = await next();
  
  // Expose specific headers to the client
  response.headers.set("Access-Control-Expose-Headers", "x-rtb-fingerprint-id, request-id");
  
  // Set Permissions-Policy header (more robust than meta tag)
  response.headers.set("Permissions-Policy", "accelerometer=(self), camera=(self), microphone=(self), geolocation=(self)");
  
  return response;
};
