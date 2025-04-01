import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const YearlyConsolidatedReport = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchAvailableYears = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.yearlyConsolidated);
      const years = [...new Set(response.data.map(report => report.financialYear))];
      setAvailableYears(years.sort().reverse());
      console.log('Available years:', years);
    } catch (err) {
      console.error('Error fetching available years:', err);
      setError('Failed to fetch available years');
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedYear !== 'all') {
        params.financialYear = selectedYear;
      }

      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      if (searchLocation.trim()) {
        params.location = searchLocation;
      }

      console.log('Fetching reports with params:', params);
      const response = await axios.get(API_ENDPOINTS.yearlyConsolidated, { params });
      console.log('Fetched reports:', response.data.length);
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports. Please try again later.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedStatus, searchLocation]);

  const fetchStats = useCallback(async () => {
    try {
      const params = {};
      if (selectedYear !== 'all') {
        params.financialYear = selectedYear;
      }
      console.log('Fetching stats with params:', params);
      const response = await axios.get(API_ENDPOINTS.yearlyConsolidatedStats, { params });
      console.log('Fetched stats:', response.data);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch statistics');
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchAvailableYears();
  }, [fetchAvailableYears]);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [fetchReports, fetchStats]);

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.yearlyConsolidated}/export`, {
        params: {
          financialYear: selectedYear !== 'all' ? selectedYear : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          location: searchLocation.trim() ? searchLocation : undefined
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `yearly_report_${selectedYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setError('Failed to export to Excel');
    }
  };

  return (
    <div className="p-4">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Workstations</h3>
            <p className="text-2xl font-semibold">{stats.totalWorkstations}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-semibold">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Occupancy</h3>
            <p className="text-2xl font-semibold">{stats.averageOccupancy.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
            <p className="text-2xl font-semibold">{stats.totalVisitors.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full p-2 border rounded bg-white flex justify-between items-center"
              >
                <span>{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
                <span className="ml-2">▼</span>
              </button>
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => {
                      setSelectedYear('all');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    All Years
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by location..."
                className="p-2 border rounded"
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={handleExportToExcel}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          {error && (
            <div className="p-4 text-center text-red-500">{error}</div>
          )}
          {loading ? (
            <div className="p-4 text-center">Loading reports...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#05364d] text-white">
                  <th className="py-2 px-4 text-left">Workstation</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Total Visitors</th>
                  <th className="py-2 px-4 text-left">Revenue</th>
                  <th className="py-2 px-4 text-left">Net Profit</th>
                  <th className="py-2 px-4 text-left">Occupancy</th>
                  <th className="py-2 px-4 text-left">Last Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center text-red-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{report.workstationName}</td>
                      <td className="py-2 px-4">{report.location}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          report.status === 'Active' ? 'bg-green-100 text-green-800' :
                          report.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">{report.yearlyStats.totalVisitors.toLocaleString()}</td>
                      <td className="py-2 px-4">${report.yearlyStats.revenue.toLocaleString()}</td>
                      <td className="py-2 px-4">${report.yearlyStats.netProfit.toLocaleString()}</td>
                      <td className="py-2 px-4">{report.yearlyStats.averageOccupancy}%</td>
                      <td className="py-2 px-4">
                        {new Date(report.lastMaintenance).toLocaleDateString()}
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

export default YearlyConsolidatedReport; 