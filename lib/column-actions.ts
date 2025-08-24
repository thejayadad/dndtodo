'use server';

import dbConnect from '@/lib/db';
import { Column } from './column-model';
import { Task } from './task-model';
import { Types } from 'mongoose';

export interface ColumnWithTasks {
  _id: string;
  title: string;
  position: number; // MUST match IColumn
  tasks: {
    _id: string;
    title: string;
    description?: string;
    columnId: string;
    position: number;
  }[];
}

// ------------------ CREATE COLUMN ------------------
export async function createColumn(title: string): Promise<ColumnWithTasks> {
  await dbConnect();

  const lastColumn = await Column.findOne().sort({ position: -1 });
  const position = lastColumn ? lastColumn.position + 1 : 0;

  const column = await Column.create({ title, position });

  return {
    _id: column._id.toString(),
    title: column.title,
    position: column.position,
    tasks: [],
  };
}

// ------------------ GET ALL COLUMNS ------------------
// ------------------ GET ALL COLUMNS ------------------
export async function getAllColumns(): Promise<ColumnWithTasks[]> {
  await dbConnect();

  // cast lean results to properly typed arrays
  const columnsDb = (await Column.find().lean()) as unknown as {
    _id: Types.ObjectId;
    title: string;
    position: number;
  }[];

  const tasksDb = (await Task.find().lean()) as unknown as {
    _id: Types.ObjectId;
    columnId: Types.ObjectId;
    title: string;
    description?: string;
    position?: number;
  }[];

  return columnsDb.map((col) => {
    const colId = col._id.toString();

    const tasks: ColumnWithTasks['tasks'] = tasksDb
      .filter((t) => t.columnId.toString() === colId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((t) => ({
        _id: t._id.toString(),
        title: t.title,
        description: t.description,
        columnId: t.columnId.toString(),
        position: t.position ?? 0,
      }));

    return {
      _id: colId,
      title: col.title,
      position: col.position,
      tasks,
    };
  });
}


// ------------------ UPDATE COLUMN TITLE ------------------
export async function updateColumnTitle(
  id: string,
  title: string
): Promise<{ _id: string; title: string }> {
  await dbConnect();

  const column = await Column.findByIdAndUpdate(id, { title }, { new: true });
  if (!column) throw new Error('Column not found');

  return {
    _id: column._id.toString(),
    title: column.title,
  };
}

// ------------------ DELETE COLUMN & TASKS ------------------
export async function deleteColumn(columnId: string): Promise<void> {
  await dbConnect();
  await Task.deleteMany({ columnId });
  await Column.findByIdAndDelete(columnId);
}
