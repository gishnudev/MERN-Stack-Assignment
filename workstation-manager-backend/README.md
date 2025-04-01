# Workstation Manager Backend

A Node.js/Express.js backend API for the Workstation Manager application.

## Features

- RESTful API endpoints
- MongoDB database integration
- Real-time data updates
- Secure authentication and authorization
- Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd workstation-manager-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## Production

To start the production server:

```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/workstation-manager
PORT=5000
```

## API Endpoints

### Workstations
- `GET /api/workstations` - Get all workstations
- `GET /api/workstations/:id` - Get a specific workstation
- `POST /api/workstations` - Create a new workstation
- `PATCH /api/workstations/:id` - Update a workstation
- `DELETE /api/workstations/:id` - Delete a workstation

### Bill Transactions
- `GET /api/bill-transactions` - Get all transactions
- `POST /api/bill-transactions` - Create a new transaction
- `PATCH /api/bill-transactions/:id` - Update a transaction
- `DELETE /api/bill-transactions/:id` - Delete a transaction

### Riders
- `GET /api/riders` - Get all riders
- `GET /api/riders/:id/location` - Get rider location
- `PATCH /api/riders/:id/location` - Update rider location
- `POST /api/riders` - Create a new rider
- `PATCH /api/riders/:id/status` - Update rider status

### Yearly Consolidated Reports
- `GET /api/yearly-consolidated` - Get all reports
- `GET /api/yearly-consolidated/summary` - Get summary by type and year
- `POST /api/yearly-consolidated` - Create a new report
- `PATCH /api/yearly-consolidated/:id` - Update a report
- `DELETE /api/yearly-consolidated/:id` - Delete a report

## Project Structure

```
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── config/          # Configuration files
└── server.js        # Main application file
``` 