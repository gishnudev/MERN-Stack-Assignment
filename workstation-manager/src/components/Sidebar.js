import React from 'react';
import {
  StarIcon,
  TruckIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  ChevronRightIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  DocumentChartBarIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const defaultMenuItems = [
  {
    icon: <StarIcon className="h-5 w-5" />,
    label: "Primary Menu",
    isOpen: true,
    children: [
      { icon: <TruckIcon className="h-4 w-4" />, label: "Rider Tracking" },
      { icon: <ComputerDesktopIcon className="h-4 w-4" />, label: "Workstation Master" },
      { icon: <DocumentTextIcon className="h-4 w-4" />, label: "Yearly Consolidated Report" }
    ]
  },
  {
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
    label: "Financial MIS Reports",
    isOpen: false,
    children: [
      { icon: <DocumentDuplicateIcon className="h-4 w-4" />, label: "Bill Transaction Report" },
      { icon: <DocumentChartBarIcon className="h-4 w-4" />, label: "Billing Statement" },
      { icon: <CreditCardIcon className="h-4 w-4" />, label: "Client Advance Report" },
      { icon: <ReceiptRefundIcon className="h-4 w-4" />, label: "Client Billing Collection" },
      { icon: <UserGroupIcon className="h-4 w-4" />, label: "Client Portal Registration MIS" },
      { icon: <ArrowsRightLeftIcon className="h-4 w-4" />, label: "Client Transaction Details" },
      { icon: <ChartPieIcon className="h-4 w-4" />, label: "Collection MIS Reports" },
      { icon: <PresentationChartLineIcon className="h-4 w-4" />, label: "Sales Summary Report" },
      { icon: <DocumentTextIcon className="h-4 w-4" />, label: "Service Wise Transaction MIS" },
      { icon: <ArrowPathIcon className="h-4 w-4" />, label: "Transaction Details MIS Report" }
    ]
  },
  {
    icon: <ClipboardDocumentIcon className="h-5 w-5" />,
    label: "Invoice MIS Reports",
    isOpen: false,
    children: []
  },
  {
    icon: <BeakerIcon className="h-5 w-5" />,
    label: "Clinical MIS Reports",
    isOpen: false,
    children: []
  },
  {
    icon: <ChartBarIcon className="h-5 w-5" />,
    label: "Revenue MIS Reports",
    isOpen: false,
    children: []
  },
  {
    icon: <Cog8ToothIcon className="h-5 w-5" />,
    label: "Operational MIS Reports",
    isOpen: false,
    children: []
  }
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen, menuItems, toggleMenuItem, handleMenuItemClick }) => {
  return (
    <>
      <aside className={`w-64 bg-[#05364d] text-white min-h-screen fixed transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } z-50 shadow-xl`}>
        <div className="p-4 bg-[#0A4B78] flex items-center justify-end">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleMenuItem(index)}
                className={`w-full px-4 py-2 flex items-center justify-between hover:bg-blue-700 transition-colors duration-200 ${
                  item.isOpen ? 'bg-[#032536]' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="ml-2 text-sm">{item.label}</span>
                </div>
                {item.children && item.children.length > 0 && (
                  <ChevronRightIcon 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      item.isOpen ? 'transform rotate-90' : ''
                    }`}
                  />
                )}
              </button>
              {item.isOpen && item.children && (
                <div className="bg-[#032536]">
                  {item.children.map((child, childIndex) => (
                    <button
                      key={childIndex}
                      onClick={() => handleMenuItemClick(child.label)}
                      className="w-full pl-12 pr-4 py-2 flex items-center text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        {child.icon}
                        <span>{child.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export { defaultMenuItems };
export default Sidebar; 