import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const WorkstationMaster = () => {
  const [workstations, setWorkstations] = useState([]);
  const [workstationName, setWorkstationName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [filter, setFilter] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workstations from the backend
  useEffect(() => {
    fetchWorkstations();
  }, [filter]);

  const fetchWorkstations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.workstations, {
        params: {
          status: filter,
          name: workstationName,
          ipAddress: ipAddress
        }
      });
      setWorkstations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch workstations. Please try again later.');
      console.error('Error fetching workstations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkstations();
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.workstations}/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'workstations.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting to Excel:', err);
    }
  };

  return (
    <div className="p-4">
      {/* Search Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Workstation Name"
                value={workstationName}
                onChange={(e) => setWorkstationName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="IP Address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isActive">Is Active</label>
              </div>
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

      {/* Workstation List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Workstation List</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
              <button
                onClick={handleExportToExcel}
                className="text-blue-600 hover:text-blue-800"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {error && (
            <div className="p-4 text-center text-red-500">{error}</div>
          )}
          {loading ? (
            <div className="p-4 text-center">Loading workstations...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#05364d] text-white">
                  <th className="py-2 px-4 text-left">S.No</th>
                  <th className="py-2 px-4 text-left">Edit</th>
                  <th className="py-2 px-4 text-left">Workstation Name</th>
                  <th className="py-2 px-4 text-left">IP Address</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {workstations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-red-500">
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  workstations.map((station, index) => (
                    <tr key={station._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      </td>
                      <td className="py-2 px-4">{station.name}</td>
                      <td className="py-2 px-4">{station.ipAddress}</td>
                      <td className="py-2 px-4">{station.status}</td>
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

export default WorkstationMaster; 