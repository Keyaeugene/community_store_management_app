'use client';

import { useState } from 'react';
import { Home, Palette, Type, Shapes, LogIn, UserPlus, Menu, FileText, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
}

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const [menuLevelsOpen, setMenuLevelsOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true }
  ];

  const uiComponents = [
    { icon: Palette, label: 'Color', href: '/color' },
    { icon: Type, label: 'Typography', href: '/typography' },
    { icon: Shapes, label: 'Icons', href: '/icons' } // Changed from Icons to Shapes
  ];

  const pages = [
    { icon: LogIn, label: 'Login', href: '/login' },
    { icon: UserPlus, label: 'Register', href: '/register' }
  ];

  const other = [
    { icon: Menu, label: 'Menu levels', href: '#', hasSubmenu: true },
    { icon: FileText, label: 'Sample page', href: '/sample' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-700 text-white transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-0 overflow-hidden'
    }`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-slate-600">
        <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">CSM</span>
        </div>
        <span className="text-lg font-semibold">Community Store Management</span>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6">
        {/* NAVIGATION Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            NAVIGATION
          </h3>
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-slate-600 text-cyan-400' 
                      : 'text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* UI COMPONENTS Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            UI COMPONENTS
          </h3>
          <ul className="space-y-2">
            {uiComponents.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* PAGES Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            PAGES
          </h3>
          <ul className="space-y-2">
            {pages.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* OTHER Section */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            OTHER
          </h3>
          <ul className="space-y-2">
            {other.map((item, index) => (
              <li key={index}>
                {item.hasSubmenu ? (
                  <button
                    onClick={() => setMenuLevelsOpen(!menuLevelsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${menuLevelsOpen ? 'rotate-90' : ''}`} />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}