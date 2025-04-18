import express from 'express';
import { body } from 'express-validator';
import {
  createTask, getTaskById, getTasks, getTaskofUser, updateTask, deleteTask

} from '../controllers/tasks.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user ID is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority level')
  ],
  validateRequest,
  createTask
);

router.get('/task/:id',
  //  authenticateUser, authorizeAdmin,
  getTaskById);

  router.get('/getall', getTasks);
router.get('/userTasks', authenticateUser, getTaskofUser);
router.patch('/update/:id', authenticateUser, authorizeAdmin, updateTask);
router.delete('/delete/:id', authenticateUser, authorizeAdmin, deleteTask);

export default router;