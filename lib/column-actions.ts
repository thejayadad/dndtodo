"use server";

import dbConnect from "@/lib/db";
import { Column, IColumn } from "./column-model";
import { Task } from "./task-model"; // assuming you have a Task model

// Create a new column
export async function createColumn(title: string): Promise<IColumn> {
  await dbConnect();
  const lastColumn = await Column.findOne().sort({ position: -1 });
  const position = lastColumn ? lastColumn.position + 1 : 0;

  const column = await Column.create({ title, position });
  return column;
}

// Update positions of columns (after drag & drop)
export async function updateColumnPositions(columns: { _id: string; position: number }[]) {
  await dbConnect();
  for (const col of columns) {
    await Column.findByIdAndUpdate(col._id, { position: col.position });
  }
}

// Delete a column and all its tasks
export async function deleteColumn(columnId: string) {
  await dbConnect();

  // Delete all tasks that belong to this column
  await Task.deleteMany({ columnId });

  // Delete the column itself
  await Column.findByIdAndDelete(columnId);
}
