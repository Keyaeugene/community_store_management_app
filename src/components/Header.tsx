'use client';

import { useState } from 'react';
import { Menu, Search, Sun, Moon, Settings, Bell, User, LogOut, Lock, Headphones } from 'lucide-react';

interface HeaderProps {
  onSidebarToggle?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function Header({ 
  onSidebarToggle, 
  userName = "Carson Darrin", 
  userEmail = "carson.darrin@company.io",
  userAvatar = "/api/placeholder/40/40"
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: "UI/UX Design",
      message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
      time: "2 min ago",
      avatar: "/api/placeholder/48/48",
      category: "Today"
    },
    {
      id: 2,
      title: "Message",
      message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500.",
      time: "1 hour ago",
      avatar: "/api/placeholder/48/48",
      category: "Today"
    },
    {
      id: 3,
      title: "Forms",
      message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
      time: "2 hour ago",
      avatar: "/api/placeholder/48/48",
      category: "Yesterday"
    }
  ];

  const handleThemeChange = (theme: 'light' | 'dark' | 'default') => {
    // Implement theme change logic
    console.log(`Switching to ${theme} theme`);
    setThemeOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Side - Mobile Menu & Search */}
        <div className="flex items-center space-x-4">
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            
            {searchOpen && (
              <div className="absolute top-12 left-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search here..."
                  className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Theme, Settings, Notifications, Profile */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sun className="w-5 h-5 text-gray-600" />
            </button>
            
            {themeOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Moon className="w-4 h-4 mr-3" />
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Sun className="w-4 h-4 mr-3" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('default')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Default
                </button>
              </div>
            )}
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            
            {settingsOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <a href="#" className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-3" />
                  My Account
                </a>
                <a href="#" className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
                <a href="#" className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Headphones className="w-4 h-4 mr-3" />
                  Support
                </a>
                <a href="#" className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Lock className="w-4 h-4 mr-3" />
                  Lock Screen
                </a>
                <a href="#" className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </a>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h5 className="font-semibold text-gray-900">Notifications</h5>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Mark all read</button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Today</p>
                    {notifications.filter(n => n.category === 'Today').map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg mb-2">
                        <img
                          src={notification.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                    
                    <p className="text-xs font-medium text-gray-500 mb-2 mt-4">Yesterday</p>
                    {notifications.filter(n => n.category === 'Yesterday').map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg mb-2">
                        <img
                          src={notification.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="px-4 py-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Clear all Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
            
            {profileOpen && (
              <div className="absolute top-12 right-0 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="bg-blue-500 px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h6 className="text-white font-medium">{userName} 🖖</h6>
                      <p className="text-blue-100 text-sm">{userEmail}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    Settings
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    Share
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Lock className="w-4 h-4 mr-3 text-gray-500" />
                    Change Password
                  </a>
                  
                  <div className="pt-2">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(searchOpen || themeOpen || settingsOpen || notificationsOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setSearchOpen(false);
            setThemeOpen(false);
            setSettingsOpen(false);
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </header>
  );
}