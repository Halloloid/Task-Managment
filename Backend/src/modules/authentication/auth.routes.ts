import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../authentication/auth.controller.js";
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getCurrentUser);

export default router;