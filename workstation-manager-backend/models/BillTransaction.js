const mongoose = require('mongoose');

const billTransactionSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  clientName: {
    type: String
  },
  visitDate: {
    type: Date,
    required: true
  },
  visitId: {
    type: String,
    required: true
  },
  grossAmount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  modeOfPayment: {
    type: String,
    enum: ['CASH', 'ONLINE', 'CARD', ''],
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BillTransaction', billTransactionSchema); 