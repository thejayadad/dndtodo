'use client';

import React from 'react';
import { toast } from 'sonner';
import { deleteTaskAction } from '@/lib/task-actions';

interface DeleteTaskButtonProps {
  columnId: string;
  taskId: string;
  onTaskDeleted: (columnId: string, taskId: string) => void;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ columnId, taskId, onTaskDeleted }) => {
  const handleDelete = async () => {
    try {
      await deleteTaskAction(taskId);
      onTaskDeleted(columnId, taskId);
      toast.success('Task deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 ml-2 text-sm">
      ✕
    </button>
  );
};

export default DeleteTaskButton;
