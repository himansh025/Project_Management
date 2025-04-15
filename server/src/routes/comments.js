import express from 'express';
import { body } from 'express-validator';
import { createComment, deleteComment } from '../controllers/comments.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  [
    body('content').trim().notEmpty().withMessage('Comment content is required'),
    body('taskId').notEmpty().withMessage('Task ID is required')
  ],
  validateRequest,
  createComment
);

router.delete('/:id', authenticateUser, deleteComment);

export default router;