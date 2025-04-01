import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Sidebar, { defaultMenuItems } from './components/Sidebar';
import Footer from './components/Footer';
import WorkstationMaster from './pages/WorkstationMaster';
import YearlyConsolidatedReport from './pages/YearlyConsolidatedReport';
import BillTransactionReport from './pages/BillTransactionReport';
import RiderTracking from './pages/RiderTracking';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState('ACCOUNT51 / RIDER TRACKING');
  const [currentView, setCurrentView] = useState('rider-tracking');
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  const toggleMenuItem = (index) => {
    setMenuItems(items => 
      items.map((item, i) => 
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const handleMenuItemClick = (label) => {
    setCurrentComponent(`ACCOUNT51 / ${label.toUpperCase()}`);
    setCurrentView(label.toLowerCase().replace(/ /g, '-'));
    setSidebarOpen(false);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'workstation-master':
        return <WorkstationMaster />;
      case 'yearly-consolidated-report':
        return <YearlyConsolidatedReport />;
      case 'bill-transaction-report':
        return <BillTransactionReport />;
      case 'rider-tracking':
        return <RiderTracking />;
      default:
        return (
          <div className="p-4">
            <h2>Select a menu item to view content</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f3f5] flex">
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        toggleMenuItem={toggleMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />

      {/* Main Content */}
      <div className="flex-1">
        <Header 
          currentComponent={currentComponent}
          setSidebarOpen={setSidebarOpen}
        />
        <Navigation />
        {renderMainContent()}
        <Footer />
      </div>
    </div>
  );
}

export default App; 