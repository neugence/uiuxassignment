import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const url = 'https://task-manager-xnd1.onrender.com';

const useCommentStore = create((set) => ({
  comments: {},
  fetchComments: async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/comments/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [taskId]: response.data.comments,
        },
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  },
  addComment: async (taskId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${url}/api/comments/task/${taskId}`, {
        content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [taskId]: [...(state.comments[taskId] || []), response.data],
        },
      }));
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },
}));

export default useCommentStore;