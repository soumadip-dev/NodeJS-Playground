import type { CorsOptions } from 'cors'; // CorsOptions type for proper typings for the CORS configuration
import cors from 'cors';

// Function that creates and returns a configured CORS middleware instance
const configureCors = (): ReturnType<typeof cors> => {
  const options: CorsOptions = {
    // Origin => Defines which origins are allowed to access the API 🌍
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow: boolean) => void
    ) => {
      const allowedOrigins: string[] = [
        'http://localhost:3000', // Local development frontend
        'https://yourcustomdomain.com', // Production frontend domain
      ];

      // Allow requests with no origin (e.g., Postman, server-to-server)
      // OR if the origin exists in the allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request ✅
      } else {
        callback(new Error('Not allowed by CORS ❌'), false);
      }
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods allowed for API access
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'], // Headers the client is allowed to send
    exposedHeaders: ['X-Total-Count', 'Content-Range'], // Headers exposed to the browser
    credentials: true, // Allow cookies, authorization headers, or TLS client certificates 🍪
    preflightContinue: false, // Let CORS handle OPTIONS requests automatically
    maxAge: 600, // Cache preflight response for 10 minutes ⏱️
    optionsSuccessStatus: 204, // Status code for successful OPTIONS requests (No Content)
  };

  return cors(options);
};

export default configureCors;
