import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../config/api';

const YearlyReport = () => {
  const [yearlyStats, setYearlyStats] = useState({
    totalWorkstations: 0,
    totalVisitors: 0,
    totalMaintenanceCost: 0,
    totalUtilityCost: 0,
    totalIncidents: 0,
    averageOccupancy: 0,
    totalRevenue: 0,
    totalNetProfit: 0,
    activeWorkstations: 0,
    maintenanceWorkstations: 0,
    inactiveWorkstations: 0
  });
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchYearlyData();
  }, [selectedYear]);

  const fetchYearlyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching data for year:', selectedYear);
      
      const [statsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_ENDPOINTS.yearlyConsolidated}/stats`, {
          params: { financialYear: selectedYear }
        }),
        axios.get(API_ENDPOINTS.yearlyConsolidated, {
          params: { financialYear: selectedYear }
        })
      ]);

      console.log('Stats response:', statsResponse.data);
      console.log('Reports response:', reportsResponse.data);

      if (!statsResponse.data || !reportsResponse.data) {
        throw new Error('No data received from the server');
      }

      setYearlyStats(statsResponse.data);
      setWorkstations(reportsResponse.data);
    } catch (err) {
      console.error('Error fetching yearly data:', err);
      setError(err.response?.data?.message || 'Failed to fetch yearly data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={fetchYearlyData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (workstations.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No data available for the selected year ({selectedYear}). Please try a different year.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Yearly Consolidated Report</h1>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overview Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workstation Status</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total Workstations:</span>
              <span className="font-medium">{yearlyStats.totalWorkstations}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Active:</span>
              <span className="font-medium text-green-600">{yearlyStats.activeWorkstations}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Maintenance:</span>
              <span className="font-medium text-yellow-600">{yearlyStats.maintenanceWorkstations}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Inactive:</span>
              <span className="font-medium text-red-600">{yearlyStats.inactiveWorkstations}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-medium text-green-600">${yearlyStats.totalRevenue.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Total Costs:</span>
              <span className="font-medium text-red-600">
                ${(yearlyStats.totalMaintenanceCost + yearlyStats.totalUtilityCost).toLocaleString()}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Net Profit:</span>
              <span className="font-medium text-green-600">${yearlyStats.totalNetProfit.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total Visitors:</span>
              <span className="font-medium">{yearlyStats.totalVisitors.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Average Occupancy:</span>
              <span className="font-medium">{yearlyStats.averageOccupancy.toFixed(1)}%</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Total Incidents:</span>
              <span className="font-medium text-red-600">{yearlyStats.totalIncidents}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Workstation Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workstation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workstations.map((workstation) => (
                <tr key={workstation._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workstation.workstationName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workstation.status === 'Active' ? 'bg-green-100 text-green-800' :
                      workstation.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workstation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workstation.yearlyStats.totalVisitors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workstation.yearlyStats.averageOccupancy.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${workstation.yearlyStats.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    ${(workstation.yearlyStats.maintenanceCost + workstation.yearlyStats.utilityCost).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${workstation.yearlyStats.netProfit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YearlyReport; 