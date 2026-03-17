import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../task/task.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Task routes
router.get('/', getTasks);          // GET /api/tasks?page=1&limit=10&status=PENDING&search=meeting
router.get('/:id', getTask);        // GET /api/tasks/:id
router.post('/', createTask);       // POST /api/tasks
router.put('/:id', updateTask);     // PUT /api/tasks/:id
router.delete('/:id', deleteTask);  // DELETE /api/tasks/:id

export default router;