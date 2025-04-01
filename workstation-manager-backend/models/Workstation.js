const mongoose = require('mongoose');

const workstationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active'
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lastMaintenance: {
    type: Date,
    default: null
  },
  specifications: {
    os: String,
    ram: String,
    processor: String,
    storage: String
  },
  assignedTo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workstation', workstationSchema); 