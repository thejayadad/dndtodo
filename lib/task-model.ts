import mongoose, { Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  columnId: mongoose.Types.ObjectId;
  position: number;
}

const TaskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
  position: { type: Number, required: true },
});

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
