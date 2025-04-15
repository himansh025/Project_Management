import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getCurrentUser,getallUsers } from '../controllers/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'team_member']).withMessage('Invalid role')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  login
);

router.post('/logout', authenticateUser, logout);
router.get('/me', getCurrentUser);
router.get('/alluser', getallUsers);

export default router;