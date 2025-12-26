import winston, { Logger } from 'winston';
import { ENV } from '../config/env.config';

//* Create a logger instance using Winston
const logger: Logger = winston.createLogger({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug', // If the app is running in production → log only 'info' or log 'debug'
  format: winston.format.combine(
    winston.format.timestamp(), // Add a timestamp (date & time) to each log entry
    winston.format.errors({ stack: true }), // Capture full error stack traces w
    winston.format.splat(), // Enable string interpolation (e.g., logger.info('Hello %s', name))
    winston.format.json() // Output logs in JSON format
  ),
  defaultMeta: { service: 'identity-service' }, // Useful to identify which service produced the log
  transports: [
    // Log messages to the console (terminal)
    new winston.transports.Console({
      // Use colorized and simple text format in terminal
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    // Log only error-level messages to a file called error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Log all messages (info, warn, error, etc.) to combined.log
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
