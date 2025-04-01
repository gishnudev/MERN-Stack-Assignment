# Workstation Manager System

A comprehensive workstation management system with bill transaction reporting and yearly consolidated reports.

## Technologies Used

### Frontend
- **React.js** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API requests
- **Heroicons** - Icon library for React
- **React Router** - For navigation and routing
- **React Hooks** - For state management and side effects
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **ExcelJS** - Excel file generation
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables management

## Features

### Bill Transaction Management
- View and manage bill transactions
- Advanced filtering and search capabilities
- Export to Excel functionality
- Real-time statistics and reporting
- Payment mode tracking
- Date range filtering
- Amount range filtering

### Yearly Consolidated Reports
- Comprehensive yearly statistics
- Workstation performance metrics
- Financial analysis
- Occupancy tracking
- Maintenance scheduling
- Export functionality

### Workstation Management
- Workstation status tracking
- Hardware specifications management
- Location management
- Maintenance scheduling
- Performance monitoring

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install Frontend Dependencies
```bash
cd workstation-manager
npm install
```

3. Install Backend Dependencies
```bash
cd workstation-manager-backend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/workstation-manager
PORT=5000
```

### Running the Application

1. Start the Backend Server
```bash
cd workstation-manager-backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd workstation-manager
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Bill Transactions
- GET `/api/bill-transactions` - Get all transactions with filters
- POST `/api/bill-transactions` - Create new transaction
- PATCH `/api/bill-transactions/:id` - Update transaction
- DELETE `/api/bill-transactions/:id` - Delete transaction
- GET `/api/bill-transactions/export` - Export to Excel

### Yearly Consolidated
- GET `/api/yearly-consolidated` - Get yearly reports
- GET `/api/yearly-consolidated/stats` - Get aggregated statistics

### Workstations
- GET `/api/workstations` - Get all workstations
- POST `/api/workstations` - Create new workstation
- PATCH `/api/workstations/:id` - Update workstation
- DELETE `/api/workstations/:id` - Delete workstation

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 