'use client'

import { useState } from "react";
import { IColumn } from "@/lib/column-model";
import { createColumn } from "@/lib/column-actions";
import { ColumnCard } from "./column-card";

interface BoardProps {
  initialColumns: (IColumn & { tasks?: any[] })[];
}

export const Board: React.FC<BoardProps> = ({ initialColumns }) => {
  const [columns, setColumns] = useState(initialColumns);

  const handleAddColumn = async () => {
    const title = prompt("Column title?");
    if (!title) return;

    const newCol = await createColumn(title); // server action
    setColumns([...columns, { ...newCol, tasks: [] }]);
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter((c) => c._id !== id));
    // optionally call deleteColumn(id) server action
  };

  return (
    <div>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <ColumnCard key={col._id} column={col} onDelete={handleDeleteColumn} />
        ))}
        <button
          onClick={handleAddColumn}
          className="w-80 flex-shrink-0 bg-green-500 text-white rounded-lg p-4 hover:bg-green-600 transition"
        >
          + Add Column
        </button>
      </div>
    </div>
  );
};
