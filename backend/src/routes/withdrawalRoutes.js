import express from 'express';
import { body } from 'express-validator';
import {
  createWithdrawal,
  getWithdrawals,
  getWithdrawal,
  confirmWithdrawal,
  cancelWithdrawal,
  getMyWithdrawals,
} from '../controllers/withdrawalController.js';
import { protect, admin, withdrawer } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/v1/withdrawals
// @desc    Create a new withdrawal request
// @access  Private
router.post(
  '/',
  [
    body('tokenAddress', 'Token address is required').not().isEmpty(),
    body('amount', 'Amount is required and must be greater than 0').isFloat({ gt: 0 }),
    body('to', 'Recipient address is required').isEthereumAddress(),
  ],
  createWithdrawal
);

// @route   GET /api/v1/withdrawals
// @desc    Get all withdrawals (admin only)
// @access  Private/Admin
router.get('/', admin, getWithdrawals);

// @route   GET /api/v1/withdrawals/:id
// @desc    Get single withdrawal
// @access  Private
router.get('/:id', getWithdrawal);

// @route   PUT /api/v1/withdrawals/:id/confirm
// @desc    Confirm a withdrawal
// @access  Private/Withdrawer
router.put('/:id/confirm', withdrawer, confirmWithdrawal);

// @route   PUT /api/v1/withdrawals/:id/cancel
// @desc    Cancel a withdrawal
// @access  Private/Admin
router.put('/:id/cancel', admin, cancelWithdrawal);

// @route   GET /api/v1/withdrawals/me
// @desc    Get current user's withdrawals
// @access  Private
router.get('/me/withdrawals', getMyWithdrawals);

export default router;
