import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const RiderTracking = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRider, setSelectedRider] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.riders, {
        params: {
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          search: searchTerm || undefined
        }
      });
      setRiders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch riders. Please try again later.');
      console.error('Error fetching riders:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchTerm]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  useEffect(() => {
    let timer;
    if (autoRefresh && seconds > 0) {
      timer = setInterval(fetchRiders, seconds * 1000);
    }
    return () => clearInterval(timer);
  }, [autoRefresh, seconds, fetchRiders]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRiders();
  };

  const handleStatusChange = async (riderId, newStatus) => {
    try {
      await axios.patch(`${API_ENDPOINTS.riders}/${riderId}/status`, {
        status: newStatus
      });
      fetchRiders();
    } catch (err) {
      console.error('Error updating rider status:', err);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.riders}/export`, {
        params: {
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          search: searchTerm || undefined
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'riders.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting to Excel:', err);
    }
  };

  const handleRiderSelect = (rider) => {
    setSelectedRider(rider.name);
    setIsDropdownOpen(false);
  };

  const handleSecondsChange = (value) => {
    setSeconds(Math.max(0, Math.min(60, value))); // Limit between 0 and 60 seconds
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with dark blue background */}
      <div className="bg-[#05364d] text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl bg-[#0A4B78] px-4 py-2 rounded">Rider Tracking</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-1 text-white hover:text-gray-200"
            onClick={fetchRiders}
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search Rider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="OnDuty">On Duty</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Controls Section */}
      <div className="bg-[#e6f3f5] p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow max-w-md relative">
            <div 
              className="w-full p-2 border rounded bg-white flex items-center justify-between cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-gray-700">{selectedRider || 'Select'}</span>
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-[#4a4a4a] border border-gray-700 rounded-md shadow-lg max-h-96 overflow-y-auto">
                {riders.map((rider) => (
                  <div
                    key={rider._id}
                    className={`px-4 py-2 cursor-pointer text-white hover:bg-[#0A4B78] ${
                      rider.name === selectedRider ? 'bg-[#0A4B78]' : ''
                    }`}
                    onClick={() => handleRiderSelect(rider)}
                  >
                    {rider.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                id="autoRefresh"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label htmlFor="autoRefresh" className="text-sm">Auto Refresh</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Seconds:</span>
              <input
                type="number"
                value={seconds}
                onChange={(e) => handleSecondsChange(parseInt(e.target.value))}
                min="0"
                max="60"
                className="w-16 p-1 border rounded text-sm bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rider List */}
      <div className="bg-white rounded-lg shadow flex-1">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Rider List</h2>
            <button
              onClick={handleExportToExcel}
              className="text-blue-600 hover:text-blue-800"
            >
              Export to Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {error && (
            <div className="p-4 text-center text-red-500">{error}</div>
          )}
          {loading ? (
            <div className="p-4 text-center">Loading riders...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#05364d] text-white">
                  <th className="py-2 px-4 text-left">S.No</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Last Location</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-red-500">
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  riders.map((rider, index) => (
                    <tr key={rider._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{rider.name}</td>
                      <td className="py-2 px-4">
                        <select
                          value={rider.status}
                          onChange={(e) => handleStatusChange(rider._id, e.target.value)}
                          className="p-1 border rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="OnDuty">On Duty</option>
                        </select>
                      </td>
                      <td className="py-2 px-4">
                        {rider.lastLocation ? (
                          <span>
                            Lat: {rider.lastLocation.latitude}, 
                            Long: {rider.lastLocation.longitude}
                          </span>
                        ) : (
                          'No location data'
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => {/* Add view location history logic */}}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderTracking; 