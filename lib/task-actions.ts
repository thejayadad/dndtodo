'use server';

import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Task } from './task-model';
import { revalidatePath } from 'next/cache';

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

export async function deleteTaskAction(taskId: string) {
  await dbConnect();

  if (!taskId) {
    throw new Error('Task ID is required');
  }

  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    throw new Error('Task not found');
  }

  // This revalidates the page so your client components refetch data
  revalidatePath('/'); // adjust path if needed
console.log("Deleted " + taskId)
  return deletedTask._id.toString();
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