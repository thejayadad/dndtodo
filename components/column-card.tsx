'use client'

import { createTask } from "@/lib/task-actions";
import { ITask } from "@/lib/task-model";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import TaskCard from "./task-card";

interface ColumnCardProps {
  column: {
    _id: string;
    title: string;
    position: number;
    tasks?: ITask[];
  };
  onDelete: (columnId: string) => void;
}

export const ColumnCard: React.FC<ColumnCardProps> = ({ column, onDelete }) => {
  const [tasks, setTasks] = useState<ITask[]>(column.tasks || []);

  const handleAddTask = async () => {
    const title = prompt("Task title?");
    if (!title) return;

    const newTask = await createTask(title, column._id);
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-80 flex-shrink-0 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">{column.title}</h2>
        <button onClick={() => onDelete(column._id)} className="text-red-500 hover:text-red-700 transition">
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className="flex flex-col mb-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDelete={(taskId) => setTasks(tasks.filter((t) => t._id !== taskId))} />
        ))}
      </div>

      <button
        onClick={handleAddTask}
        className="mt-auto py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        + Add Task
      </button>
    </div>
  );
};
