# Workstation Manager Frontend

A modern React application for managing workstations, built with React, Tailwind CSS, and TypeScript.

## Features

- Modern, responsive UI
- Real-time workstation status monitoring
- Yearly consolidated reports
- Bill transaction management
- Rider tracking system

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd workstation-manager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── config/        # Configuration files
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  └── App.tsx        # Main application component
```
