const express = require('express');
const router = express.Router();
const Workstation = require('../models/Workstation');

// Get all workstations
router.get('/', async (req, res) => {
  try {
    const { status, location } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const workstations = await Workstation.find(query).sort({ name: 1 });
    res.json(workstations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single workstation
router.get('/:id', async (req, res) => {
  try {
    const workstation = await Workstation.findById(req.params.id);
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }
    res.json(workstation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new workstation
router.post('/', async (req, res) => {
  const workstation = new Workstation(req.body);
  try {
    const newWorkstation = await workstation.save();
    res.status(201).json(newWorkstation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update workstation
router.patch('/:id', async (req, res) => {
  try {
    const workstation = await Workstation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(workstation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update workstation maintenance
router.patch('/:id/maintenance', async (req, res) => {
  try {
    const workstation = await Workstation.findByIdAndUpdate(
      req.params.id,
      {
        lastMaintenance: new Date(),
        status: 'Maintenance'
      },
      { new: true }
    );
    res.json(workstation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete workstation
router.delete('/:id', async (req, res) => {
  try {
    await Workstation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workstation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 