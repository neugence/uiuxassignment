import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["task", "information"],
    required: true,
  },

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task", // Reference to the Task model
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", MessageSchema, "Messages");
export default Message;
