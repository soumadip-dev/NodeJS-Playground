import app from './app.js';
import { connectDB } from './config/db.config.js';
import { ENV } from './config/env.config.js';
import logger from './utils/logger.utils.js';

const PORT = ENV.PORT;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection ❌ at ${promise}, Reason: ${reason} `);
});

const startServer = async () => {
  await connectDB();

  // Start the server
  const server = app.listen(PORT, () => {
    logger.info(`Identity service running on http://localhost:${PORT} 🌐`);
  });

  // Handle server errors
  server.on('error', err => {
    if ('code' in err && err.code === 'EADDRINUSE') {
      logger.error(
        `Port ${PORT} is already in use. Please stop the running process or use a different port. ⚠️`
      );
    } else {
      logger.error('Failed to start server ❌', { error: err });
    }
    process.exit(1);
  });
};

startServer();
