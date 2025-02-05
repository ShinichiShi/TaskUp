import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Backlog", "Ongoing", "Completed"], default: "Backlog" },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

export const Task = models.Task || model("Task", TaskSchema);
