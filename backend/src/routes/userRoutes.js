import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/me', getMyProfile);
router.put(
  '/me',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
  ],
  updateMyProfile
);

// Admin routes
router.use(admin);

router
  .route('/')
  .get(getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(
    [
      body('name', 'Name is required').not().isEmpty(),
      body('email', 'Please include a valid email').isEmail(),
      body('role', 'Please include a valid role').isIn(['user', 'admin', 'withdrawer']),
    ],
    updateUser
  )
  .delete(deleteUser);

export default router;
