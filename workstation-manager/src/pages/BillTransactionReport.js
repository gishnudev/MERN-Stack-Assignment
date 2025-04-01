import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const BillTransactionReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMode: 'all',
    searchTerm: '',
    minAmount: '',
    maxAmount: ''
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0
  });
  const [selectedBranch, setSelectedBranch] = useState('Choose Diagnostics LLC');
  const [referralType, setReferralType] = useState('');
  const [clientName, setClientName] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.paymentMode !== 'all') params.modeOfPayment = filters.paymentMode;
      if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;

      const response = await axios.get(API_ENDPOINTS.billTransactions, { params });
      setTransactions(response.data);
      
      // Calculate stats
      const totalAmount = response.data.reduce((sum, t) => sum + t.netAmount, 0);
      const totalPaid = response.data.reduce((sum, t) => sum + t.paidAmount, 0);
      const totalDue = response.data.reduce((sum, t) => sum + t.dueAmount, 0);
      
      setStats({
        totalTransactions: response.data.length,
        totalAmount,
        totalPaid,
        totalDue
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.billTransactions}/export`, {
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill_transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setError('Failed to export to Excel');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with dark blue background */}
      <div className="bg-[#05364d] text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl bg-[#0A4B78] px-4 py-2 rounded">Bill Transaction MIS Report</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-white">From:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
              name="startDate"
              className="border rounded px-2 py-1 text-sm text-black bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-white">To:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
              name="endDate"
              className="border rounded px-2 py-1 text-sm text-black bg-white"
            />
          </div>
          <button 
            className="flex items-center space-x-1 text-white hover:text-gray-200"
            onClick={fetchTransactions}
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Search</span>
          </button>
          <div className="flex space-x-2">
            <button className="text-white hover:text-gray-200" onClick={handleExportToExcel}>
              Export to Excel
            </button>
            <button className="text-white hover:text-gray-200">
              Export to PDF
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section with lighter blue background */}
      <div className="bg-[#e6f3f5] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search By Patient Name / Patient ID / Encounter ID"
              className="w-full pl-10 pr-4 py-2 border rounded bg-white"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              name="searchTerm"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={referralType}
            onChange={(e) => setReferralType(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            <option value="">Referral Type</option>
            <option value="doctor">Doctor</option>
            <option value="walkin">Walk-in</option>
            <option value="client">Client</option>
          </select>
          <input
            type="text"
            placeholder="Search Client Name"
            className="border rounded px-3 py-2 bg-white"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            <option value="Choose Diagnostics LLC">Choose Diagnostics LLC</option>
            {/* Add more branches as needed */}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="text-2xl font-semibold">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <p className="text-2xl font-semibold">${stats.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
          <p className="text-2xl font-semibold">${stats.totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Due</h3>
          <p className="text-2xl font-semibold">${stats.totalDue.toLocaleString()}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="flex-1 overflow-x-auto">
        {error && (
          <div className="p-4 text-center text-red-500">{error}</div>
        )}
        {loading ? (
          <div className="p-4 text-center">Loading transactions...</div>
        ) : (
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-[#05364d] text-white">
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">S.No</th>
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">Receipt Number</th>
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">Patient Name</th>
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">Client Name</th>
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">Visit Date</th>
                <th className="py-3 px-4 text-left font-medium border-r border-gray-600">Visit ID</th>
                <th className="py-3 px-4 text-right font-medium border-r border-gray-600">Gross Amount</th>
                <th className="py-3 px-4 text-right font-medium border-r border-gray-600">Discount</th>
                <th className="py-3 px-4 text-right font-medium border-r border-gray-600">Net Amount</th>
                <th className="py-3 px-4 text-right font-medium border-r border-gray-600">Paid Amount</th>
                <th className="py-3 px-4 text-right font-medium border-r border-gray-600">Due Amount</th>
                <th className="py-3 px-4 text-left font-medium">Mode of Payment</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-4 px-4 text-center text-red-500">
                    No Record Found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr key={transaction._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border-r">{index + 1}</td>
                    <td className="py-2 px-4 border-r">{transaction.receiptNumber}</td>
                    <td className="py-2 px-4 border-r">{transaction.patientName}</td>
                    <td className="py-2 px-4 border-r">{transaction.clientName}</td>
                    <td className="py-2 px-4 border-r">{new Date(transaction.visitDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-r">{transaction.visitId}</td>
                    <td className="py-2 px-4 text-right border-r">{transaction.grossAmount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right border-r">{transaction.discount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right border-r">{transaction.netAmount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right border-r">{transaction.paidAmount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right border-r">{transaction.dueAmount.toFixed(2)}</td>
                    <td className="py-2 px-4">{transaction.modeOfPayment || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BillTransactionReport; 