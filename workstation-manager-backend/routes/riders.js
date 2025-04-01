const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');

// Get all riders
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find().sort({ name: 1 });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rider location
router.get('/:id/location', async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.json({
      location: rider.location,
      lastUpdated: rider.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update rider location
router.patch('/:id/location', async (req, res) => {
  try {
    const { coordinates } = req.body;
    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      {
        location: {
          type: 'Point',
          coordinates
        },
        lastUpdated: new Date()
      },
      { new: true }
    );
    res.json(rider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create new rider
router.post('/', async (req, res) => {
  const rider = new Rider(req.body);
  try {
    const newRider = await rider.save();
    res.status(201).json(newRider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rider status
router.patch('/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    res.json(rider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 