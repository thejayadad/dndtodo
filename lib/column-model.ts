import mongoose, { Document, Model } from "mongoose";

export interface IColumn extends Document {
  title: string;
  position: number;
}

const ColumnSchema = new mongoose.Schema<IColumn>({
  title: { type: String, required: true },
  position: { type: Number, required: true },
});

export const Column: Model<IColumn> = mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);
