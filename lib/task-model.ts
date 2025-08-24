// task-model.ts
import mongoose, { Document, Schema, Types } from "mongoose";

// DB type
export interface ITaskDocument extends Document {
  filter(arg0: (t: any) => boolean): unknown;
  title: string;
  description?: string;
  position: number;
  columnId: Types.ObjectId;
}

// Frontend type
export interface ITask {
  _id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
}

const TaskSchema = new Schema<ITaskDocument>({
  title: { type: String, required: true },
  description: String,
  position: { type: Number, required: true },
  columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
});

export const Task = mongoose.models.Task || mongoose.model<ITaskDocument>("Task", TaskSchema);
