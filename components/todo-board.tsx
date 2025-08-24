'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { IColumn } from '@/lib/column-model';
import { ITask } from '@/lib/task-model';
import {
  createColumn,
  getAllColumns,
  deleteColumn,
  updateColumnTitle,
} from '@/lib/column-actions';
import { createTask, deleteTask, updateTaskPosition } from '@/lib/task-actions';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

export interface ColumnWithTasks extends IColumn {
  tasks?: ITask[];
}

interface TodoBoardProps {
  initialColumns?: ColumnWithTasks[];
}

const TodoBoard: React.FC<TodoBoardProps> = ({ initialColumns = [] }) => {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      setFetching(true);
      try {
        const allColumns = await getAllColumns();
        setColumns(allColumns);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchColumns();
  }, []);

  const handleAddColumn = async () => {
    setLoading(true);
    try {
      const newColumn = await createColumn('New Column');
      setColumns([...columns, { ...newColumn, tasks: [] }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColumn = async (id: string) => {
    try {
      await deleteColumn(id);
      setColumns(columns.filter((col) => col._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateColumnTitle = async (id: string, title: string) => {
    try {
      await updateColumnTitle(id, title);
      setColumns(columns.map((col) => (col._id === id ? { ...col, title } : col)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (columnId: string, title: string) => {
    try {
      const newTask = await createTask(columnId, title);
      setColumns(
        columns.map((col) =>
          col._id === columnId ? { ...col, tasks: [...(col.tasks || []), newTask] } : col
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

const handleDeleteTask = async (columnId: string, taskId: string) => {
  try {
    const deletedId = await deleteTask(taskId);

    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col._id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks?.filter((t) => t._id !== deletedId) || [],
        };
      })
    );

    toast.success('Task deleted!');
  } catch (err) {
    console.error(err);
    toast.error((err as Error).message || 'Failed to delete task');
  }
};





  // DnD setup
  const sensors = useSensors(useSensor(PointerSensor));

const handleDragEnd = async (event: DragEndEvent, columnId: string) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  // Find the column being dragged
  const column = columns.find((col) => col._id === columnId);
  if (!column || !column.tasks) return;

  const columnTasks = [...column.tasks];
  const oldIndex = columnTasks.findIndex((t) => t._id === active.id);
  const newIndex = columnTasks.findIndex((t) => t._id === over.id);

  const newTasks = arrayMove(columnTasks, oldIndex, newIndex);

  // Update state immediately
  setColumns((prev) =>
    prev.map((col) =>
      col._id === columnId ? { ...col, tasks: newTasks } : col
    )
  );

  try {
    // Persist positions in DB
    await Promise.all(
      newTasks.map((task, idx) => updateTaskPosition(task._id, columnId, idx))
    );
    toast.success("Tasks reordered!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save task order");
  }
};



  return (
    <div className="px-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 h-full mx-auto max-w-screen-xl">
      {fetching ? (
        <div>Loading columns...</div>
      ) : (
        columns.map((col) => (
          <Column
            key={col._id}
            column={col}
            onDelete={handleDeleteColumn}
            onUpdateTitle={handleUpdateColumnTitle}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          />
        ))
      )}

      <button
        onClick={handleAddColumn}
        disabled={loading}
        className="h-[300px] col-span-1 bg-neutral-500 text-white rounded-lg shadow flex items-center justify-center hover:bg-blue-600 transition"
      >
        {loading ? 'Adding...' : '+ New Board'}
      </button>
    </div>
  );
};

interface ColumnProps {
  column: ColumnWithTasks;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onAddTask: (columnId: string, title: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onDragEnd: (event: DragEndEvent, columnId: string) => void;
  sensors: any;
}

const Column: React.FC<ColumnProps> = ({
  column,
  onDelete,
  onUpdateTitle,
  onAddTask,
  onDeleteTask,
  onDragEnd,
  sensors,
}) => {
  const [title, setTitle] = useState(column.title);
  const [taskInput, setTaskInput] = useState('');

  const handleTitleBlur = () => {
    if (title !== column.title) {
      onUpdateTitle(column._id, title);
    }
  };

  const handleAddTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAddTask(column._id, taskInput.trim());
    setTaskInput('');
  };

  return (
    <div className="h-[300px] bg-white rounded-lg flex flex-col shadow">
      <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="font-semibold text-sm w-full border-none focus:outline-none"
        />
        <button onClick={() => onDelete(column._id)} className="text-red-500 ml-2 text-sm">
          ✕
        </button>
      </div>

      {/* DnD Task List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd(e, column._id)}>
        <SortableContext items={column.tasks?.map((t) => t._id) || []} strategy={verticalListSortingStrategy}>
          <div className="px-3 py-2 flex-1 overflow-auto">
            {column.tasks?.map((task) => (
              <SortableTask key={task._id} task={task} onDelete={() => onDeleteTask(column._id, task._id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <form onSubmit={handleAddTaskSubmit} className="px-3 py-2 border-t border-neutral-200">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task..."
          className="w-full text-sm px-2 py-1 border rounded focus:outline-none border-neutral-100"
        />
      </form>
    </div>
  );
};

interface SortableTaskProps {
  task: ITask;
  onDelete: () => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="py-1 border-b border-neutral-200 text-sm flex items-center justify-between bg-white rounded mb-1"
    >
      <span>{task.title}</span>
         <button onClick={onDelete} className="text-red-500 text-xs ml-2">
        ✕
      </button>
    </div>
  );
};

export default TodoBoard;
