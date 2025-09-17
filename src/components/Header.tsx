'use client';

import { useState } from 'react';
import { Menu, Search, Sun, Moon, Settings, Bell, User } from 'lucide-react';

interface HeaderProps {
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;  // This prop was missing
}

export default function Header({ onSidebarToggle, sidebarOpen = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 z-30 ${
      sidebarOpen ? 'left-64' : 'left-0'
    }`}>
      {/* Left side - Menu toggle and search */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Theme, settings, notifications, profile */}
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Sun className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"></span>
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}