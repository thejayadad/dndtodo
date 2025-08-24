"use client";

import { ITask } from "@/lib/task-model";
import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface TaskCardProps {
  task: ITask;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded shadow flex justify-between items-center hover:shadow-md transition">
      <span>{task.title}</span>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        <FiTrash2 size={16} />
      </button>
    </div>
  );
};

export default TaskCard;
