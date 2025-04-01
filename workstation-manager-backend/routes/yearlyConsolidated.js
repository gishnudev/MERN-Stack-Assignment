const express = require('express');
const router = express.Router();
const YearlyConsolidated = require('../models/YearlyConsolidated');
const Workstation = require('../models/Workstation');

// Get yearly consolidated reports with filters
router.get('/', async (req, res) => {
  try {
    const { financialYear, status, location } = req.query;
    let query = {};

    if (financialYear) {
      query.financialYear = financialYear;
    }

    if (status) {
      query.status = status;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    const reports = await YearlyConsolidated.find(query)
      .sort({ workstationName: 1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get aggregated yearly statistics
router.get('/stats', async (req, res) => {
  try {
    const { financialYear } = req.query;
    let query = {};

    if (financialYear) {
      query.financialYear = financialYear;
    }

    const stats = await YearlyConsolidated.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalWorkstations: { $sum: 1 },
          totalVisitors: { $sum: '$yearlyStats.totalVisitors' },
          totalMaintenanceCost: { $sum: '$yearlyStats.maintenanceCost' },
          totalUtilityCost: { $sum: '$yearlyStats.utilityCost' },
          totalIncidents: { $sum: '$yearlyStats.incidents' },
          totalRevenue: { $sum: '$yearlyStats.revenue' },
          totalNetProfit: { $sum: '$yearlyStats.netProfit' },
          averageOccupancy: { $avg: '$yearlyStats.averageOccupancy' },
          activeWorkstations: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          maintenanceWorkstations: {
            $sum: { $cond: [{ $eq: ['$status', 'Maintenance'] }, 1, 0] }
          },
          inactiveWorkstations: {
            $sum: { $cond: [{ $eq: ['$status', 'Inactive'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalWorkstations: 0,
      totalVisitors: 0,
      totalMaintenanceCost: 0,
      totalUtilityCost: 0,
      totalIncidents: 0,
      totalRevenue: 0,
      totalNetProfit: 0,
      averageOccupancy: 0,
      activeWorkstations: 0,
      maintenanceWorkstations: 0,
      inactiveWorkstations: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new yearly consolidated report
router.post('/', async (req, res) => {
  try {
    const workstation = await Workstation.findById(req.body.workstationId);
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }

    const report = new YearlyConsolidated({
      ...req.body,
      workstationName: workstation.name,
      location: workstation.location,
      status: workstation.status,
      facilities: workstation.facilities,
      contactPerson: workstation.contactPerson,
      operatingHours: workstation.operatingHours,
      lastMaintenance: workstation.lastMaintenance,
      nextMaintenance: workstation.nextMaintenance
    });

    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update yearly consolidated report
router.patch('/:id', async (req, res) => {
  try {
    const report = await YearlyConsolidated.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete yearly consolidated report
router.delete('/:id', async (req, res) => {
  try {
    await YearlyConsolidated.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 