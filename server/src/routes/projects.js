import express from 'express';
import { body } from 'express-validator';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject,deleteProject,removeUserFromProject,addUserToProject } from '../controllers/projects.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
  ],
  validateRequest,
  createProject
);

router.get('/', getAllProjects);
router.get('/getproject/:id', getProjectById);

router.patch(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  [
    body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
  ],
  validateRequest,
  updateProject
);

router.delete('/delete/:id', authenticateUser, authorizeAdmin, deleteProject);

router.post('/project/userAdd', authenticateUser, authorizeAdmin, addUserToProject);

router.delete('/project/userRemove', authenticateUser, authorizeAdmin, removeUserFromProject);

router.delete('/delete/project', authenticateUser, authorizeAdmin, deleteProject);

export default router;