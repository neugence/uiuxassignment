import express from "express";
import mongoose from "mongoose";
import dotenv, { populate } from "dotenv";
import User from "./Schema/userSchema.js";
import Project from "./Schema/projectSchema.js";
import Task from "./Schema/taskSchema.js";

import Message from "./Schema/messageSchema.js";
import Phase from "./Schema/phaseSchema.js";
import Tasks from "./Schema/taskSchema.js";



dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 2833;
const DB = process.env.DATA_BASE;
app.use(express.json());
app.listen(PORT, async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database Connected");
    console.log(`Server up and running at port ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Use await to resolve the promise
    res.status(200).json( users );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});




app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: "peopleWorkingOn", // Populating people working on the project
      })
      .populate({
        path: "phases",
        populate: [
          {
            path: "messages",
            populate: {
              path: "assignedTo", // Populating assignedTo inside messages
            },
          },
        ],
      });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching projects." });
  }
});


app.post("/messages", async (req, res) => {
  try {
    console.log(req.body);
    const { assignedTo, phaseId, assignedOn, deadline, Title, taskAssigned,description } =
      req.body;

    // Check if taskAssigned is 'on'
    if (taskAssigned !== "on") {
      // No task assigned, create an informational message
      const newMessage = new Message({
        content: Title,
        type: "information", // No task involved, save as informational message
        assignedTo: assignedTo,
        description // You can still associate users
      });

      await newMessage.save();

      // Push the new message ID to the phase's messages array
      const phase = await Phase.findById(phaseId);
      if (phase) {
        phase.messages.push(newMessage._id);
        await phase.save();
      }

      return res
        .status(400)
        .json({
          error: "Task must be assigned (taskAssigned must be 'on').",
          message: newMessage,
        });
    }

    // Check if the task is assigned (i.e., assignedTo is not empty or null)
    if (!assignedTo || assignedTo.length === 0) {
      return res
        .status(400)
        .json({ error: "Task must be assigned to at least one user." });
    }

    // Ensure startDate and endDate are valid
    const startDate = new Date(assignedOn);
    const endDate = new Date(deadline);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res
        .status(400)
        .json({ error: "Invalid date format for startDate or endDate." });
    }

    // Create the task based on the received data
    const newTask = new Task({
      title: Title, // Ensure you extract the title from the formData
      assignedTo, // The assignedTo field is an array of user IDs
      startDate, // Convert to Date
      endDate, // Convert to Date
      status: "Open",
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Now create the message with reference to the newly created task
    const newMessage = new Message({
      content: Title,
      type: "task", // Since the task is created, it's a task-related message
      assignedTo, // Associated users for the message
      task: savedTask._id,
      description, // Reference to the task
    });

    // Save the message to the database
    await newMessage.save();

    // Push the new message ID to the phase's messages array
    const phase = await Phase.findById(phaseId);
    if (phase) {
      phase.messages.push(newMessage._id);
      await phase.save();
    }

    // Respond with success
    res
      .status(201)
      .json({
        message: "Task created successfully",
        task: savedTask,
        message: newMessage,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating the task." });
  }
});
app.post("/phases/:phaseId/todos", async (req, res) => {
  try {
    console.log(req.body);
    const { task,status } = req.body;
    const phaseId = req.params.phaseId;

    const phase = await Phase.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    // Create a new to-do item
    const newTodo = {
      title:task,
      status
    };

    // Add to the phase's todoList
    phase.todoList.push(newTodo);
    await phase.save();

    res.status(201).json({ message: "To-do added successfully", phase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while adding to-do." });
  }
});
app.delete("/phases/:phaseId/todos/:todoId", async (req, res) => {
  try {
    const { phaseId, todoId } = req.params;
    console.log(phaseId,todoId);
    // Find the phase by ID
    const phase = await Phase.findById(phaseId);
    console.log(phase);
    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    // Remove the to-do item from the phase's todoList
    phase.todoList = phase.todoList.filter(
      (todo) => todo._id.toString() !== todoId
    );

    // Save the updated phase document
    await phase.save();

    res.json({ message: "To-Do deleted successfully", phase });
  } catch (error) {
    console.error("Error deleting to-do:", error);
    res.status(500).json({ error: "Server error while deleting to-do." });
  }
});
app.post("/phases", async (req, res) => {
  try {
    const { name, projectId,title,description} = req.body;
    console.log("Creating phase:", name);

    if (!name || !projectId) {
      return res
        .status(400)
        .json({ error: "Phase name and project ID are required." });
    }

    // Create a new phase
    const newPhase = new Phase({
      name,
      header: {
        title,
        content:description
      },
      messages: [],
      todoList: [],
    });

    // Save the phase to the database
    const savedPhase = await newPhase.save();

    // Find the project and push the new phase ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    project.phases.push(savedPhase._id);
    await project.save();

    res
      .status(201)
      .json({
        message: "Phase created and added to project",
        phase: savedPhase,
        project,
      });
  } catch (error) {
    console.error("Error creating phase:", error);
    res.status(500).json({ error: "Server error while creating phase." });
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const data = await Tasks.find();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

app.post("/phase/header", async (req, res) => {
  const { title, content, phaseId } = req.body;
    console.log(phaseId, title, content,req.body);
  try {
    // Update the header with title and content for the specified phase
    const data = await Phase.findByIdAndUpdate(
      phaseId,
      {
        $set: {
          "header.title": title,
          "header.content": content,
        },
      },
      { new: true } // Return the updated document
    );

    if (!data) {
      return res.status(404).json({ error: "Phase not found" });
    }

    res.status(200).json({ success: true, phase: data });
  } catch (error) {
    console.error("Error updating phase header:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.patch("/message", async (req, res) => {
  const { title, description, phaseId } = req.body;
  console.log(title,description,phaseId);
  try {
    // Update the header with title and content for the specified phase
    const data = await Message.findByIdAndUpdate(
      phaseId,
      {
        $set: {
          content: title,
          description,
        },
      },
      { new: true } // Return the updated document
    );

    if (!data) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ success: true, phase: data });
  } catch (error) {
    console.error("Error updating phase header:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/message", async (req, res) => {
  let { messageId, phaseId, taskId } = req.body;

  try {
    console.log("Received Data:", messageId, phaseId, taskId, req.body);

    // Ensure messageId and taskId can handle both single values and arrays
    const messageArray = Array.isArray(messageId) ? messageId : [messageId];
    const taskArray = Array.isArray(taskId) ? taskId : taskId ? [taskId] : [];

    if (!messageArray[0]) {
      return res.status(400).json({ error: "messageId is required" });
    }

    // Delete all tasks if taskArray exists
    if (taskArray.length > 0) {
      await Tasks.deleteMany({ _id: { $in: taskArray } });
    }

    // Delete all messages
    await Message.deleteMany({ _id: { $in: messageArray } });

    // Remove deleted messages from the phase
    if (phaseId) {
      await Phase.findByIdAndUpdate(
        phaseId,
        { $pull: { messages: { $in: messageArray } } },
        { new: true }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/phase", async (req, res) => {
  try {
    const { phaseId, messageArray, taskArray } = req.body;
    console.log(phaseId, messageArray, taskArray, "sdbhds");

    if (!phaseId) {
      return res.status(400).json({ error: "phaseId is required" });
    }

    // Handle message and task deletion first
    if (Array.isArray(messageArray) && messageArray.length > 0) {
      const response = await fetch("http://localhost:2833/message", {
        method: "DELETE",
        body: JSON.stringify({
          messageId: messageArray,
          taskId: taskArray,
          phaseId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json(); // Ensure response is awaited
      if (!response.ok) {
        console.error("Error deleting messages:", data);
        return res
          .status(response.status)
          .json({ error: data.error || "Failed to delete messages" });
      }
    }

    // Now delete the phase after messages are removed
    const deletedPhase = await Phase.findByIdAndDelete(phaseId);

    if (!deletedPhase) {
      return res
        .status(404)
        .json({ error: "Phase not found or already deleted" });
    }

    res
      .status(200)
      .json({ success: true, message: "Phase deleted successfully" });
  } catch (error) {
    console.error("Error deleting phase:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


