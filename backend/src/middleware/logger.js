import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for request logs
const requestLogStream = fs.createWriteStream(
  path.join(logsDir, 'requests.log'),
  { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'errors.log'),
  { flags: 'a' }
);

// Log request details
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : 'anonymous',
      body: req.body,
      query: req.query,
      params: req.params
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logData.time}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
    
    // Log to file
    requestLogStream.write(JSON.stringify(logData) + '\n');
  });
  
  next();
};

// Log errors
export const errorLogger = (err, req, res, next) => {
  const errorLog = {
    time: new Date().toISOString(),
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      statusCode: err.statusCode || 500
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : 'anonymous'
    }
  };
  
  // Log to console
  console.error('\x1b[31m', `[${errorLog.time}] ERROR: ${err.message}`);
  console.error('\x1b[31m', err.stack);
  
  // Log to file
  errorLogStream.write(JSON.stringify(errorLog) + '\n');
  
  next(err);
};

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  const errorLog = {
    time: new Date().toISOString(),
    level: 'error',
    message: 'Unhandled Rejection',
    reason: reason.toString(),
    stack: reason.stack
  };
  
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  errorLogStream.write(JSON.stringify(errorLog) + '\n');
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  const errorLog = {
    time: new Date().toISOString(),
    level: 'error',
    message: 'Uncaught Exception',
    error: error.toString(),
    stack: error.stack
  };
  
  console.error('Uncaught Exception:', error);
  errorLogStream.write(JSON.stringify(errorLog) + '\n');
  
  // Exit the process with a failure code
  process.exit(1);
});
