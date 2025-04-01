const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/bill-transactions', require('./routes/billTransactions'));
app.use('/api/riders', require('./routes/riders'));
app.use('/api/workstations', require('./routes/workstations'));
app.use('/api/yearly-consolidated', require('./routes/yearlyConsolidated'));

// Sample Data Initialization
const BillTransaction = require('./models/BillTransaction');
const Rider = require('./models/Rider');
const Workstation = require('./models/Workstation');
const YearlyConsolidated = require('./models/YearlyConsolidated');

const initializeSampleData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      BillTransaction.deleteMany({}),
      Rider.deleteMany({}),
      Workstation.deleteMany({}),
      YearlyConsolidated.deleteMany({})
    ]);

    // Sample Bill Transactions
    const billTransactions = [
      {
        receiptNumber: 'BS3003075',
        patientName: 'PRADESHA PAYAROTH KRISHNAN',
        visitDate: new Date('2025-03-05T20:33:00'),
        visitId: 'ONC1003075',
        grossAmount: 7.00,
        discount: 7.00,
        netAmount: 0.00,
        paidAmount: 0.00,
        dueAmount: 0.00
      },
      {
        receiptNumber: 'BS3003080',
        patientName: 'SAMEER BHAJI',
        clientName: '',
        visitDate: new Date('2025-03-07T09:25:00'),
        visitId: 'ONC1003080',
        grossAmount: 470.00,
        discount: 0.00,
        netAmount: 470.00,
        paidAmount: 470.00,
        dueAmount: 0.00,
        modeOfPayment: 'ONLINE'
      },
      {
        receiptNumber: 'BS3003081',
        patientName: 'RAHUL KUMAR',
        clientName: 'Dr. Sarah Chen',
        visitDate: new Date('2025-03-07T10:15:00'),
        visitId: 'ONC1003081',
        grossAmount: 850.00,
        discount: 50.00,
        netAmount: 800.00,
        paidAmount: 800.00,
        dueAmount: 0.00,
        modeOfPayment: 'CASH'
      },
      {
        receiptNumber: 'BS3003082',
        patientName: 'PRIYA SHARMA',
        clientName: 'Dr. Michael Johnson',
        visitDate: new Date('2025-03-07T11:30:00'),
        visitId: 'ONC1003082',
        grossAmount: 1200.00,
        discount: 100.00,
        netAmount: 1100.00,
        paidAmount: 600.00,
        dueAmount: 500.00,
        modeOfPayment: 'CARD'
      },
      {
        receiptNumber: 'BS3003083',
        patientName: 'AMIT PATEL',
        clientName: 'Dr. Emily Davis',
        visitDate: new Date('2025-03-07T14:20:00'),
        visitId: 'ONC1003083',
        grossAmount: 650.00,
        discount: 0.00,
        netAmount: 650.00,
        paidAmount: 650.00,
        dueAmount: 0.00,
        modeOfPayment: 'ONLINE'
      },
      {
        receiptNumber: 'BS3003084',
        patientName: 'NEHA GUPTA',
        clientName: 'Dr. David Wilson',
        visitDate: new Date('2025-03-07T15:45:00'),
        visitId: 'ONC1003084',
        grossAmount: 950.00,
        discount: 150.00,
        netAmount: 800.00,
        paidAmount: 800.00,
        dueAmount: 0.00,
        modeOfPayment: 'CASH'
      },
      {
        receiptNumber: 'BS3003085',
        patientName: 'ARUN SINGH',
        clientName: 'Dr. Sarah Chen',
        visitDate: new Date('2025-03-07T16:30:00'),
        visitId: 'ONC1003085',
        grossAmount: 750.00,
        discount: 0.00,
        netAmount: 750.00,
        paidAmount: 0.00,
        dueAmount: 750.00,
        modeOfPayment: null
      },
      {
        receiptNumber: 'BS3003086',
        patientName: 'MEERA RAJAN',
        clientName: 'Dr. Michael Johnson',
        visitDate: new Date('2025-03-08T09:15:00'),
        visitId: 'ONC1003086',
        grossAmount: 1100.00,
        discount: 100.00,
        netAmount: 1000.00,
        paidAmount: 1000.00,
        dueAmount: 0.00,
        modeOfPayment: 'CARD'
      },
      {
        receiptNumber: 'BS3003087',
        patientName: 'VIJAY KUMAR',
        clientName: 'Dr. Emily Davis',
        visitDate: new Date('2025-03-08T10:45:00'),
        visitId: 'ONC1003087',
        grossAmount: 850.00,
        discount: 50.00,
        netAmount: 800.00,
        paidAmount: 800.00,
        dueAmount: 0.00,
        modeOfPayment: 'ONLINE'
      },
      {
        receiptNumber: 'BS3003088',
        patientName: 'ANITA DESAI',
        clientName: 'Dr. David Wilson',
        visitDate: new Date('2025-03-08T11:30:00'),
        visitId: 'ONC1003088',
        grossAmount: 1200.00,
        discount: 0.00,
        netAmount: 1200.00,
        paidAmount: 600.00,
        dueAmount: 600.00,
        modeOfPayment: 'CASH'
      }
    ];

    // Sample Riders
    const riders = [
      { name: 'Oncolab' },
      { name: 'CDoncolab' },
      { name: 'muzammil' },
      { name: 'SAFEER KARAT' },
      { name: 'Dr.Saeid Ghulam Hossein Azizi' },
      { name: 'SUHA' },
      { name: 'WALMAT ALI' },
      { name: 'GOPIKA' },
      { name: 'ANJU JOHN' },
      { name: 'ANN KATHLEEN' },
      { name: 'REJISH' },
      { name: 'MUHEENUDEEN MK' },
      { name: 'ERFAN ALAM' },
      { name: 'THOMAS' },
      { name: 'NILEENA V R' },
      { name: 'ARSHA K R' }
    ];

    // Sample Workstations
    const workstations = [
      {
        name: 'WS-001',
        status: 'Active',
        ipAddress: '192.168.1.101',
        location: 'Main Office',
        specifications: {
          os: 'Windows 10 Pro',
          ram: '16GB',
          processor: 'Intel i7',
          storage: '512GB SSD'
        }
      },
      {
        name: 'WS-002',
        status: 'Maintenance',
        ipAddress: '192.168.1.102',
        location: 'Lab Room',
        specifications: {
          os: 'Windows 10 Pro',
          ram: '32GB',
          processor: 'Intel i9',
          storage: '1TB SSD'
        },
        lastMaintenance: new Date()
      },
      {
        name: 'WS-003',
        status: 'Active',
        ipAddress: '192.168.1.103',
        location: 'Research Lab',
        specifications: {
          os: 'Windows 11 Pro',
          ram: '64GB',
          processor: 'AMD Ryzen 9',
          storage: '2TB NVMe SSD'
        }
      },
      {
        name: 'WS-004',
        status: 'Active',
        ipAddress: '192.168.1.104',
        location: 'Development Center',
        specifications: {
          os: 'Ubuntu 22.04 LTS',
          ram: '32GB',
          processor: 'Intel i9',
          storage: '1TB SSD'
        }
      },
      {
        name: 'WS-005',
        status: 'Inactive',
        ipAddress: '192.168.1.105',
        location: 'Training Room',
        specifications: {
          os: 'Windows 10 Pro',
          ram: '16GB',
          processor: 'Intel i5',
          storage: '256GB SSD'
        }
      },
      {
        name: 'WS-006',
        status: 'Active',
        ipAddress: '192.168.1.106',
        location: 'Design Studio',
        specifications: {
          os: 'macOS Ventura',
          ram: '32GB',
          processor: 'Apple M2',
          storage: '1TB SSD'
        }
      },
      {
        name: 'WS-007',
        status: 'Maintenance',
        ipAddress: '192.168.1.107',
        location: 'Server Room',
        specifications: {
          os: 'Windows Server 2022',
          ram: '128GB',
          processor: 'Intel Xeon',
          storage: '4TB RAID'
        },
        lastMaintenance: new Date()
      },
      {
        name: 'WS-008',
        status: 'Active',
        ipAddress: '192.168.1.108',
        location: 'Testing Lab',
        specifications: {
          os: 'Windows 10 Pro',
          ram: '16GB',
          processor: 'Intel i7',
          storage: '512GB SSD'
        }
      }
    ];

    // Sample Yearly Consolidated Reports
    const yearlyReports = [
      // 2024 Reports
      {
        financialYear: '2024',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Main Office',
        location: '123 Business Street, City Center',
        status: 'Active',
        monthlyData: {
          JAN: 1200,
          FEB: 1150,
          MAR: 1250,
          APR: 1300,
          MAY: 1400,
          JUN: 1500,
          JULY: 1600,
          AUG: 1550,
          SEP: 1450,
          OCT: 1350,
          NOV: 1250,
          DEC: 1200
        },
        yearlyStats: {
          totalVisitors: 15800,
          maintenanceCost: 45000,
          utilityCost: 75000,
          incidents: 12,
          averageOccupancy: 85,
          revenue: 250000,
          netProfit: 130000
        },
        facilities: ['WiFi', 'Parking', 'Meeting Rooms', 'Cafeteria'],
        contactPerson: {
          name: 'John Smith',
          phone: '+1-555-0123',
          email: 'john.smith@company.com'
        },
        operatingHours: '9:00 AM - 6:00 PM',
        lastMaintenance: new Date('2024-03-15'),
        nextMaintenance: new Date('2024-04-15')
      },
      {
        financialYear: '2024',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Research Lab',
        location: '456 Research Avenue, Science Park',
        status: 'Active',
        monthlyData: {
          JAN: 1800,
          FEB: 1900,
          MAR: 2000,
          APR: 2100,
          MAY: 2200,
          JUN: 2300,
          JULY: 2400,
          AUG: 2300,
          SEP: 2200,
          OCT: 2100,
          NOV: 2000,
          DEC: 1900
        },
        yearlyStats: {
          totalVisitors: 25100,
          maintenanceCost: 85000,
          utilityCost: 120000,
          incidents: 18,
          averageOccupancy: 92,
          revenue: 420000,
          netProfit: 215000
        },
        facilities: ['WiFi', 'Parking', 'Research Equipment', 'Lab Space', 'Conference Rooms'],
        contactPerson: {
          name: 'Dr. Sarah Chen',
          phone: '+1-555-0124',
          email: 'sarah.chen@company.com'
        },
        operatingHours: '24/7',
        lastMaintenance: new Date('2024-03-20'),
        nextMaintenance: new Date('2024-04-20')
      },
      // 2023 Reports
      {
        financialYear: '2023',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Main Office',
        location: '123 Business Street, City Center',
        status: 'Active',
        monthlyData: {
          JAN: 1100,
          FEB: 1050,
          MAR: 1150,
          APR: 1200,
          MAY: 1300,
          JUN: 1400,
          JULY: 1500,
          AUG: 1450,
          SEP: 1350,
          OCT: 1250,
          NOV: 1150,
          DEC: 1100
        },
        yearlyStats: {
          totalVisitors: 14800,
          maintenanceCost: 42000,
          utilityCost: 70000,
          incidents: 10,
          averageOccupancy: 82,
          revenue: 230000,
          netProfit: 118000
        },
        facilities: ['WiFi', 'Parking', 'Meeting Rooms', 'Cafeteria'],
        contactPerson: {
          name: 'John Smith',
          phone: '+1-555-0123',
          email: 'john.smith@company.com'
        },
        operatingHours: '9:00 AM - 6:00 PM',
        lastMaintenance: new Date('2023-03-15'),
        nextMaintenance: new Date('2023-04-15')
      },
      {
        financialYear: '2023',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Development Center',
        location: '789 Tech Boulevard, Innovation Hub',
        status: 'Active',
        monthlyData: {
          JAN: 2000,
          FEB: 2100,
          MAR: 2200,
          APR: 2300,
          MAY: 2400,
          JUN: 2500,
          JULY: 2600,
          AUG: 2500,
          SEP: 2400,
          OCT: 2300,
          NOV: 2200,
          DEC: 2100
        },
        yearlyStats: {
          totalVisitors: 28100,
          maintenanceCost: 88000,
          utilityCost: 130000,
          incidents: 14,
          averageOccupancy: 93,
          revenue: 510000,
          netProfit: 292000
        },
        facilities: ['WiFi', 'Parking', 'Development Tools', 'Meeting Rooms', 'Cafeteria'],
        contactPerson: {
          name: 'Mike Johnson',
          phone: '+1-555-0125',
          email: 'mike.j@company.com'
        },
        operatingHours: '24/7',
        lastMaintenance: new Date('2023-03-25'),
        nextMaintenance: new Date('2023-04-25')
      },
      // 2022 Reports
      {
        financialYear: '2022',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Design Studio',
        location: '321 Creative Lane, Arts District',
        status: 'Active',
        monthlyData: {
          JAN: 1300,
          FEB: 1400,
          MAR: 1500,
          APR: 1600,
          MAY: 1700,
          JUN: 1800,
          JULY: 1900,
          AUG: 1800,
          SEP: 1700,
          OCT: 1600,
          NOV: 1500,
          DEC: 1400
        },
        yearlyStats: {
          totalVisitors: 18100,
          maintenanceCost: 60000,
          utilityCost: 90000,
          incidents: 8,
          averageOccupancy: 87,
          revenue: 300000,
          netProfit: 150000
        },
        facilities: ['WiFi', 'Parking', 'Design Tools', 'Studio Space', 'Meeting Rooms'],
        contactPerson: {
          name: 'Emily Davis',
          phone: '+1-555-0126',
          email: 'emily.d@company.com'
        },
        operatingHours: '9:00 AM - 7:00 PM',
        lastMaintenance: new Date('2022-03-30'),
        nextMaintenance: new Date('2022-04-30')
      },
      {
        financialYear: '2022',
        workstationId: new mongoose.Types.ObjectId(),
        workstationName: 'Testing Lab',
        location: '567 Quality Street, Testing District',
        status: 'Active',
        monthlyData: {
          JAN: 1100,
          FEB: 1200,
          MAR: 1300,
          APR: 1400,
          MAY: 1500,
          JUN: 1600,
          JULY: 1700,
          AUG: 1600,
          SEP: 1500,
          OCT: 1400,
          NOV: 1300,
          DEC: 1200
        },
        yearlyStats: {
          totalVisitors: 16100,
          maintenanceCost: 50000,
          utilityCost: 80000,
          incidents: 7,
          averageOccupancy: 85,
          revenue: 260000,
          netProfit: 130000
        },
        facilities: ['WiFi', 'Parking', 'Testing Equipment', 'Lab Space', 'Meeting Rooms'],
        contactPerson: {
          name: 'David Wilson',
          phone: '+1-555-0127',
          email: 'david.w@company.com'
        },
        operatingHours: '8:00 AM - 6:00 PM',
        lastMaintenance: new Date('2022-04-01'),
        nextMaintenance: new Date('2022-05-01')
      }
    ];

    // Insert sample data
    await Promise.all([
      BillTransaction.insertMany(billTransactions),
      Rider.insertMany(riders),
      Workstation.insertMany(workstations),
      YearlyConsolidated.insertMany(yearlyReports)
    ]);

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Initialize sample data when the server starts
initializeSampleData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 