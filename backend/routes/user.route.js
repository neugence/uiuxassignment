import express from 'express';
import userController from '../controllers/user.controller.js';
import auth from '..//middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/all', auth, userController.getAllUsers); // Admin only

export default router;