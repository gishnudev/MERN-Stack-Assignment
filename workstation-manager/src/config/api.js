const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  billTransactions: `${API_BASE_URL}/bill-transactions`,
  riders: `${API_BASE_URL}/riders`,
  workstations: `${API_BASE_URL}/workstations`,
  yearlyConsolidated: `${API_BASE_URL}/yearly-consolidated`,
  yearlyConsolidatedStats: `${API_BASE_URL}/yearly-consolidated/stats`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`
  }
};

export default API_BASE_URL; 