import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Search Bar */}
      <div className="relative w-96 hidden md:block">
        <input 
          type="text" 
          placeholder="Tìm kiếm nhanh (Ctrl + K)..." 
          className="w-full bg-slate-800 border border-slate-700 text-gray-300 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-vtv-green focus:ring-1 focus:ring-vtv-green transition-all"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
      </div>

      {/* Actions Right */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle (Fake UI for now) */}
        <button className="p-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-yellow-400 transition">
          <Sun size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;