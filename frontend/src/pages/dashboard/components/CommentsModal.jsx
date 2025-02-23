import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareMore } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useCommentStore from '@/store/commentStore';

const CommentsModal = ({ task }) => {
  const { comments, fetchComments, addComment } = useCommentStore();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments(task._id);
  }, [fetchComments, task._id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    await addComment(task._id, newComment);
    setNewComment("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MessageSquareMore className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(comments[task._id] || []).map((comment, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded flex items-start justify-between gap-4">
                <div className="flex-grow">{comment.content}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{comment.user?.name}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar} />
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;