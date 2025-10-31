import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

// Import middlewares
import { requestLogger, errorLogger } from './middleware/logger.js';
import { publicApiLimiter, authLimiter, withdrawalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/error.js';

// Route files
import tokenRoutes from './routes/tokenRoutes.js';
import authRoutes from './routes/authRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Debug: Log environment variables
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Server Port:', process.env.PORT);

// Connect to MongoDB
connectDB();

// Initialize express
const app = express();

// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Request logging
app.use(requestLogger);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
}));

// Prevent XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Apply rate limiting
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/withdrawals', withdrawalLimiter);
app.use('/api', publicApiLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/token', tokenRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/withdrawals', withdrawalRoutes);
app.use('/api/audits', auditRoutes);

// Error logging middleware
app.use(errorLogger);

// Handle 404 - Not Found
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the RaceFi API',
    version: '1.0.0',
    documentation: '/api/v1/docs', // Will be added later with Swagger
    timestamp: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/token', tokenRoutes);

// Error handling middleware (must be after all other middleware and routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

const httpServer = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
