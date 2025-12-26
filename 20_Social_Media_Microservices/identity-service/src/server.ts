import app from './app.js';
import { ENV } from './config/env.config.js';

const PORT = ENV.PORT;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} 🌐`);
});

// Handle server errors
server.on('error', err => {
  if ('code' in err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Please stop the running process or use a different port ⚠️`
    );
  } else {
    console.error('Failed to start the server ❌', err);
  }
  process.exit(1);
});
