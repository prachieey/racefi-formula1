import { validationResult } from 'express-validator';
import { ErrorResponse } from './error.js';

// Middleware to handle validation errors
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return next(new ErrorResponse('Validation Error', 400, errorMessages));
  };
};

// Common validation rules
export const commonRules = {
  email: () => 
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address'),
      
  password: (field = 'password') => 
    body(field)
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter'),
      
  ethereumAddress: (field = 'address') =>
    body(field)
      .trim()
      .isEthereumAddress()
      .withMessage('Please provide a valid Ethereum address'),
      
  tokenAmount: (field = 'amount') =>
    body(field)
      .isNumeric()
      .withMessage('Amount must be a number')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0')
};
