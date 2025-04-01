import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workstations from '../data/workstations';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const WorkstationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workstation, setWorkstation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredFacilities, setFilteredFacilities] = useState([]);

  useEffect(() => {
    const foundWorkstation = workstations.find(w => w._id === id);
    if (foundWorkstation) {
      setWorkstation(foundWorkstation);
      setFilteredFacilities(foundWorkstation.facilities);
    } else {
      navigate('/workstations');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (workstation) {
      let filtered = [...workstation.facilities];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(facility =>
          facility.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== 'All') {
        filtered = filtered.filter(facility => {
          // Add your facility status logic here
          return true;
        });
      }

      setFilteredFacilities(filtered);
    }
  }, [searchTerm, statusFilter, workstation]);

  if (!workstation) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/workstations')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Workstations
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workstation.name}</h1>
              <p className="text-gray-500 mt-1">{workstation.location}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              workstation.status === 'Active' ? 'bg-green-100 text-green-800' :
              workstation.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {workstation.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Contact Person:</span> {workstation.contactPerson}</p>
                <p><span className="font-medium">Phone:</span> {workstation.phone}</p>
                <p><span className="font-medium">Email:</span> {workstation.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Total Capacity:</span> {workstation.capacity}</p>
                <p><span className="font-medium">Current Occupancy:</span> {workstation.currentOccupancy}</p>
                <p><span className="font-medium">Operating Hours:</span> {workstation.operatingHours}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Maintenance</p>
                <p className="font-medium">{workstation.lastMaintenance}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Next Maintenance</p>
                <p className="font-medium">{workstation.nextMaintenance}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Facilities</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search facilities..."
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
                  <option value="All">All Facilities</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredFacilities.map((facility, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkstationDetails; 