import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import workstations from '../data/workstations';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const WorkstationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [filteredWorkstations, setFilteredWorkstations] = useState(workstations);

  useEffect(() => {
    let filtered = [...workstations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(workstation =>
        workstation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workstation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workstation.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(workstation => workstation.status === statusFilter);
    }

    // Apply capacity filter
    if (capacityFilter !== 'All') {
      const [min, max] = capacityFilter.split('-').map(Number);
      filtered = filtered.filter(workstation => 
        workstation.capacity >= min && workstation.capacity <= max
      );
    }

    setFilteredWorkstations(filtered);
  }, [searchTerm, statusFilter, capacityFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workstations</h1>
        <Link
          to="/workstations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Workstation
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search workstations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="All">All Capacities</option>
            <option value="0-20">0-20</option>
            <option value="21-40">21-40</option>
            <option value="41-60">41-60</option>
            <option value="61-100">61-100</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredWorkstations.length} workstations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkstations.map((workstation) => (
          <div
            key={workstation._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{workstation.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workstation.status)}`}>
                  {workstation.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{workstation.location}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Capacity: {workstation.capacity}</span>
                <span>Occupied: {workstation.currentOccupancy}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {workstation.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {facility}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Link
                  to={`/workstations/${workstation._id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
                <span className="text-sm text-gray-500">
                  Last Maintenance: {workstation.lastMaintenance}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkstationList; 