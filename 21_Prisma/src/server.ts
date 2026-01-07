import app from './app.js';

const PORT = process.env.PORT ?? 8080;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
});

const startServer = async (): Promise<void> => {
  const server = app.listen(PORT, () => {
    console.info(`Identity service running on http://localhost:${PORT}`);
  });

  // Handle server errors
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Stop the running process or use a different port.`
      );
    } else {
      console.error('Failed to start server', err);
    }
    process.exit(1);
  });
};

startServer().catch(err => {
  console.error('Error while starting server', err);
  process.exit(1);
});
