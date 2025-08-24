
## SETUP
- package.json
- global.css | package.json
- load homepage

## DATABASE SETUP
- log into mongodb
- install mongoose
- add lib directory with function
- add model and update .env - for both of course


## SERVER ACTIONS
- add column & task actions 
- explain how they work

## LAYOUT SETUP
- npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons
- apply style
- set the layout
- header then potential board
```
import TodoBoard from '@/components/todo-board';
import React from 'react';

const HomePage = () => {
  return (
    <main className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center border-b border-dotted border-neutral-200 h-16 px-4">
        <div className="mx-auto max-w-screen-xl w-full">
          <h1 className="font-black text-2xl">My Todo's</h1>
        </div>
      </nav>

      {/* Board Area */}
      <div className="flex-1 overflow-auto py-4 bg-blue-200">
        <TodoBoard />
      </div>
    </main>
  );
};

export default HomePage;

```

- components
- todo board
- import it in 

```
import React from 'react'

const TodoBoard = () => {
  return (
    <div className='px-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-full mx-auto max-w-screen-xl'>
        <button
        className='h-[300px] col-span-1 bg-white '
        >New Board</button>    
    </div>
  )
}

export default TodoBoard

```

## ADD COLUMNS 

- server actions
```
"use server";

import dbConnect from "@/lib/db";
import { Column } from "./column-model";
import { Task } from "./task-model";

// Create a new column
export async function createColumn(title: string) {
  await dbConnect();

  // Find the current max position
  const maxColumn = await Column.findOne().sort({ position: -1 }).lean();
  const newPosition = maxColumn ? maxColumn.position + 1 : 1;

  const column = await Column.create({ title, position: newPosition });

  // Return a plain object with string _id
  return {
    _id: column._id.toString(),
    title: column.title,
    position: column.position,
  };
}

// Update positions of columns
export async function updateColumnPositions(columns: { _id: string; position: number }[]) {
  await dbConnect();
  for (const col of columns) {
    await Column.findByIdAndUpdate(col._id, { position: col.position });
  }
}

// Delete a column and its tasks
export async function deleteColumn(columnId: string) {
  await dbConnect();

  await Task.deleteMany({ columnId });
  await Column.findByIdAndDelete(columnId);
}

```

- Front end
```
'use client';

import React, { useState } from 'react';
import { IColumn } from '@/lib/column-model';
import { ITask } from '@/lib/task-model';
import { createColumn } from '@/lib/column-actions';

export interface ColumnWithTasks extends IColumn {
  tasks?: ITask[];
}

interface TodoBoardProps {
  initialColumns?: ColumnWithTasks[];
}

const TodoBoard: React.FC<TodoBoardProps> = ({ initialColumns = [] }) => {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="px-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 h-full mx-auto max-w-screen-xl">
      {columns.map((col) => (
        <div key={col._id} className="h-[300px] bg-white rounded-lg shadow">
          <div className='px-4 h-[240px]'>
                <div className='py-2'>{col.title}</div>
                    <div className='h-full'>
                        <div>Task 1</div>
                        <div>Task 1</div>
                        <div>Task 1</div>
                        <div>Task 1</div>

                    </div>
                <div>Footer</div>
            </div>
        </div>
      ))}

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

export default TodoBoard;


```


- display alll columns

- server actions
```


```

- frontend ui
```
'use client';

import React, { useState, useEffect } from 'react';
import { IColumn } from '@/lib/column-model';
import { ITask } from '@/lib/task-model';
import { createColumn, getAllColumns } from '@/lib/column-actions';

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

  // Fetch all columns on mount
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

  return (
    <div className="px-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 h-full mx-auto max-w-screen-xl">
      {fetching ? (
        <div>Loading columns...</div>
      ) : (
        columns.map((col) => (
          <div key={col._id} className="h-[300px] bg-white rounded-lg flex flex-col">
            <div className="px-4 h-[240px] flex flex-col">
              <div className="py-2 font-semibold">{col.title}</div>
              <div className="flex-1 overflow-auto">
                {col.tasks?.map((task) => (
                  <div key={task._id} className="py-1 border-b border-neutral-200">
                    {task.title}
                  </div>
                ))}
              </div>
              <div className="pt-2 text-sm text-gray-500">Footer</div>
            </div>
          </div>
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

export default TodoBoard;

```
- task card component
- column card component


- install drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
