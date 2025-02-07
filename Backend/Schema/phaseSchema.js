import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PhaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  header: {
    title:{
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  todoList: [TodoSchema], // Embedding the to-do list inside Phase
});

const Phase = mongoose.model("Phase", PhaseSchema, "Phases");
export default Phase;
