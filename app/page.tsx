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
      <div className="flex-1 overflow-auto py-4 bg-neutral-100">
        <TodoBoard />
      </div>
    </main>
  );
};

export default HomePage;
