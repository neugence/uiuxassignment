import Comment from '../models/comment.model.js';
import Task from '../models/task.model.js';

const commentController = {
  // Create new comment
  createComment: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { content, parentComment, mentions } = req.body;

      // Verify task exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const comment = new Comment({
        task: taskId,
        user: req.user._id,
        content,
        parentComment,
        mentions
      });

      await comment.save();
      
      // Populate user and mentions
      await comment.populate([
        { path: 'user', select: 'name avatar' },
        { path: 'mentions', select: 'name avatar' }
      ]);

      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get comments for a task
  getTaskComments: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const comments = await Comment.find({ task: taskId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name avatar')
        .populate('mentions', 'name avatar')
        .populate('parentComment');

      const total = await Comment.countDocuments({ task: taskId });

      res.json({
        comments,
        total,
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update comment
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, mentions } = req.body;

      const comment = await Comment.findById(id);
      
      // Verify comment exists and user is the author
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to edit this comment' });
      }

      comment.content = content;
      if (mentions) comment.mentions = mentions;
      
      await comment.save();
      await comment.populate([
        { path: 'user', select: 'name avatar' },
        { path: 'mentions', select: 'name avatar' }
      ]);

      res.json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete comment
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByIdAndDelete(id);

      // Verify comment exists and user is the author
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default commentController;