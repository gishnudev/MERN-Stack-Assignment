import React from 'react';
import {
  ArrowPathIcon,
  DocumentPlusIcon,
  TrashIcon,
  PrinterIcon,
  CheckIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const navButtons = [
  { icon: <DocumentPlusIcon className="h-5 w-5" />, label: "Create" },
  { icon: <CheckIcon className="h-5 w-5" />, label: "Save" },
  { icon: <PrinterIcon className="h-5 w-5" />, label: "Print" },
  { icon: <EnvelopeIcon className="h-5 w-5" />, label: "Email" },
  { icon: <TrashIcon className="h-5 w-5" />, label: "Clear" },
  { icon: <ArrowPathIcon className="h-5 w-5" />, label: "Refresh" },
  { icon: <TruckIcon className="h-5 w-5" />, label: "Despatch" },
  { icon: <ArrowDownTrayIcon className="h-5 w-5" />, label: "Fetch" },
  { icon: <ExclamationCircleIcon className="h-5 w-5" />, label: "Issues" },
  { icon: <XMarkIcon className="h-5 w-5" />, label: "Close" }
];

const Navigation = () => {
  return (
    <nav className="bg-[#05364d] text-white border-b border-gray-700">
      <div className="flex justify-between px-2 py-1">
        <div className="grid grid-cols-10 gap-1 w-full">
          {navButtons.map((button, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-700 rounded transition-colors duration-200"
              title={button.label}
            >
              {button.icon}
              <span className="text-[10px] mt-1 font-medium">
                {button.label}
              </span>
            </button>
          ))}
        </div>
        <div className="scrolling-container ml-4 flex items-center">
          <div className="text-yellow-300 text-sm scrolling-text">
            there is no outstanding payment and your last due date is 23-03-2025.
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 