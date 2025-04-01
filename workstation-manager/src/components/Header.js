import React from 'react';
import {
  ComputerDesktopIcon,
  UserCircleIcon,
  BellAlertIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const Header = ({ currentComponent, setSidebarOpen }) => {
  return (
    <header className="bg-[#0A4B78] text-white sticky top-0 z-40">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center">
          <button 
            className="p-2 hover:bg-blue-700 rounded transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="bg-white text-[#0A4B78] px-4 py-2 rounded ml-2 flex items-center">
            <ComputerDesktopIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold">Diagnostics</span>
          </div>
          <h1 className="text-xl ml-4">Oncolab Diagnostics LLC</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span>{currentComponent}</span>
          </div>
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
            <BellAlertIcon className="h-6 w-6" />
          </div>
          <UserCircleIcon className="h-8 w-8" />
          <span>THOMAS</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 