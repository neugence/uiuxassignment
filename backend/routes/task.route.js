import express from 'express';
import taskController from '../controllers/task.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.put('/:id/reorder', auth, taskController.reorderTask);

export default router;