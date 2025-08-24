'use server';

import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Task } from './task-model';

export async function createTask(columnId: string, title: string) {
  await dbConnect();

  // Find last task in this column
  const lastTask = await Task.findOne({ columnId }).sort({ position: -1 });
  const position = lastTask ? lastTask.position + 1 : 0;

  const task = await Task.create({ title, columnId, position });
  return {
    _id: task._id.toString(),
    title: task.title,
    columnId: task.columnId.toString(),
    position: task.position,
  };
}

export async function deleteTask(taskId: string) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error('Invalid taskId');
  }

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  return task._id.toString(); // return string id
}


export async function updateTaskPosition(taskId: string, columnId: string, position: number) {
  await dbConnect();
  const task = await Task.findByIdAndUpdate(
    taskId,
    { columnId, position },
    { new: true }
  );
  if (!task) throw new Error('Task not found');
  return {
    _id: task._id.toString(),
    title: task.title,
    columnId: task.columnId.toString(),
    position: task.position,
  };
}