// column-model.ts
import mongoose, { Document, Schema, Types } from "mongoose";

// DB type
export interface IColumnDocument extends Document {
  title: string;
  position: number;
}

// Frontend type
export interface IColumn {
  _id: string;
  title: string;
  position: number;
}

const ColumnSchema = new Schema<IColumnDocument>({
  title: { type: String, required: true },
  position: { type: Number, required: true },
});

export const Column = mongoose.models.Column || mongoose.model<IColumnDocument>("Column", ColumnSchema);
