"use server";

import dbConnect from "@/lib/db";
import { Task, ITask } from "./task-model"; 

export async function createTask(title: string, columnId: string): Promise<ITask> {
  await dbConnect();
  const lastTask = await Task.find({ columnId }).sort({ position: -1 }).limit(1);
  const position = lastTask.length > 0 ? lastTask[0].position + 1 : 0;

  const task = await Task.create({ title, columnId, position });
  return task;
}

export async function updateTaskPosition(taskId: string, newColumnId: string, newPosition: number): Promise<ITask | null> {
  await dbConnect();
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  task.columnId = newColumnId as any;
  task.position = newPosition;
  await task.save();
  return task;
}

export async function deleteTask(taskId: string) {
  await dbConnect();
  await Task.findByIdAndDelete(taskId);
}