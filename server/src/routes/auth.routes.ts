import { Router } from 'express';
import {
    register,
    login,
    getCurrentUser,
    validateToken,
    refreshToken,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.get('/validate', authenticate, validateToken);
router.post('/refresh', authenticate, refreshToken);

export default router;
