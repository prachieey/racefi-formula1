import rateLimit from 'express-rate-limit';
import ErrorResponse from './error.js';

// Rate limiting for public API endpoints
export const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  }
});

// Rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again after an hour',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  }
});

// Rate limiting for withdrawal endpoints
export const withdrawalLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit each user to 5 withdrawal requests per day
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  message: 'You have reached the daily withdrawal limit',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  }
});

// Rate limiting for admin endpoints
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit to 1000 requests per windowMs
  message: 'Too many admin requests, please try again later',
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  },
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  }
});
