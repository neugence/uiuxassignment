import express from 'express';
import commentController from '../controllers/comment.controller.js';
import auth from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/task/:taskId', auth, commentController.createComment);
router.get('/task/:taskId', auth, commentController.getTaskComments);
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

export default router;
