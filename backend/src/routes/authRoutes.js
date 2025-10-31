import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
);

// @route   GET /api/v1/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, getUserProfile);

// @route   PUT /api/v1/auth/me
// @desc    Update user profile
// @access  Private
router.put(
  '/me',
  protect,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
  ],
  updateUserProfile
);

// @route   POST /api/v1/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post(
  '/forgot-password',
  [body('email', 'Please include a valid email').isEmail()],
  forgotPassword
);

// @route   PUT /api/v1/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put(
  '/reset-password/:token',
  [
    body('password', 'Please enter a password with 6 or more characters').isLength(
      { min: 6 }
    ),
  ],
  resetPassword
);

export default router;
