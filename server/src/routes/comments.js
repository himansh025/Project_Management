import express from 'express';
import { body } from 'express-validator';
import { createComment, deleteComment, getCommentsByTask } from '../controllers/comments.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Create a new comment
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

// Get comments for a task
router.get('/all/:taskId', authenticateUser, getCommentsByTask);

// Delete a comment
router.delete('/delete/:commentId', authenticateUser, deleteComment);

export default router;