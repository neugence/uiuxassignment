import Task from '../models/task.model.js';

const taskController = {
  // Create new task
  createTask: async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        createdBy: req.user._id
      });
      await task.save();
      await task.populate('assignees', 'name avatar');
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get tasks with filtering, sorting, and pagination
  getTasks: async (req, res) => {
    try {
      const { status, search, sortBy, order, page = 1, limit = 10 } = req.query;
      
      // Build query
      const query = {};
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort options
      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
      }

      const tasks = await Task.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('assignees', 'name avatar')
        .populate('createdBy', 'name');

      const total = await Task.countDocuments(query);

      res.json({
        tasks,
        total,
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update task
  updateTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).populate('assignees', 'name avatar');
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete task
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  reorderTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { order, status } = req.body;

      // Update orders of other tasks
      await Task.updateMany(
        { 
          status,
          order: { $gte: order }
        },
        { $inc: { order: 1 } }
      );

      // Update the dragged task
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: { order, status } },
        { new: true }
      ).populate('assignees', 'name avatar');

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export default taskController;