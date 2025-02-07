import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    peopleWorkingOn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User collection
      },
    ],
    phases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase", // References the Phase collection
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema,"Project");
export default Project
