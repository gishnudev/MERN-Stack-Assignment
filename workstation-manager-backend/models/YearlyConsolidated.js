const mongoose = require('mongoose');

const yearlyConsolidatedSchema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true
  },
  workstationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workstation',
    required: true
  },
  workstationName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Inactive'],
    required: true
  },
  monthlyData: {
    JAN: { type: Number, default: 0 },
    FEB: { type: Number, default: 0 },
    MAR: { type: Number, default: 0 },
    APR: { type: Number, default: 0 },
    MAY: { type: Number, default: 0 },
    JUN: { type: Number, default: 0 },
    JULY: { type: Number, default: 0 },
    AUG: { type: Number, default: 0 },
    SEP: { type: Number, default: 0 },
    OCT: { type: Number, default: 0 },
    NOV: { type: Number, default: 0 },
    DEC: { type: Number, default: 0 }
  },
  yearlyStats: {
    totalVisitors: { type: Number, default: 0 },
    maintenanceCost: { type: Number, default: 0 },
    utilityCost: { type: Number, default: 0 },
    incidents: { type: Number, default: 0 },
    averageOccupancy: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    netProfit: { type: Number, default: 0 }
  },
  facilities: [{
    type: String
  }],
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  operatingHours: String,
  lastMaintenance: Date,
  nextMaintenance: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

yearlyConsolidatedSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('YearlyConsolidated', yearlyConsolidatedSchema); 