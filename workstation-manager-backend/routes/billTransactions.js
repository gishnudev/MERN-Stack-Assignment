const express = require('express');
const router = express.Router();
const BillTransaction = require('../models/BillTransaction');
const excel = require('exceljs');

// Get all bill transactions with filters
router.get('/', async (req, res) => {
  try {
    const query = {};

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.visitDate = {};
      if (req.query.startDate) {
        query.visitDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.visitDate.$lte = new Date(req.query.endDate);
      }
    }

    // Payment mode filter
    if (req.query.modeOfPayment) {
      query.modeOfPayment = req.query.modeOfPayment;
    }

    // Amount range filter
    if (req.query.minAmount || req.query.maxAmount) {
      query.netAmount = {};
      if (req.query.minAmount) {
        query.netAmount.$gte = parseFloat(req.query.minAmount);
      }
      if (req.query.maxAmount) {
        query.netAmount.$lte = parseFloat(req.query.maxAmount);
      }
    }

    // Search filter
    if (req.query.search) {
      query.$or = [
        { patientName: { $regex: req.query.search, $options: 'i' } },
        { receiptNumber: { $regex: req.query.search, $options: 'i' } },
        { visitId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const transactions = await BillTransaction.find(query).sort({ visitDate: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching bill transactions:', error);
    res.status(500).json({ message: 'Error fetching bill transactions' });
  }
});

// Export to Excel
router.get('/export', async (req, res) => {
  try {
    const query = {};

    // Apply the same filters as the GET route
    if (req.query.startDate || req.query.endDate) {
      query.visitDate = {};
      if (req.query.startDate) {
        query.visitDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.visitDate.$lte = new Date(req.query.endDate);
      }
    }

    if (req.query.modeOfPayment) {
      query.modeOfPayment = req.query.modeOfPayment;
    }

    if (req.query.minAmount || req.query.maxAmount) {
      query.netAmount = {};
      if (req.query.minAmount) {
        query.netAmount.$gte = parseFloat(req.query.minAmount);
      }
      if (req.query.maxAmount) {
        query.netAmount.$lte = parseFloat(req.query.maxAmount);
      }
    }

    if (req.query.search) {
      query.$or = [
        { patientName: { $regex: req.query.search, $options: 'i' } },
        { receiptNumber: { $regex: req.query.search, $options: 'i' } },
        { visitId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const transactions = await BillTransaction.find(query).sort({ visitDate: -1 });

    // Create Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Bill Transactions');

    // Define columns
    worksheet.columns = [
      { header: 'Receipt No.', key: 'receiptNumber', width: 15 },
      { header: 'Patient Name', key: 'patientName', width: 30 },
      { header: 'Visit Date', key: 'visitDate', width: 15 },
      { header: 'Visit ID', key: 'visitId', width: 15 },
      { header: 'Gross Amount', key: 'grossAmount', width: 15 },
      { header: 'Discount', key: 'discount', width: 15 },
      { header: 'Net Amount', key: 'netAmount', width: 15 },
      { header: 'Paid Amount', key: 'paidAmount', width: 15 },
      { header: 'Due Amount', key: 'dueAmount', width: 15 },
      { header: 'Payment Mode', key: 'modeOfPayment', width: 15 }
    ];

    // Add data
    transactions.forEach(transaction => {
      worksheet.addRow({
        ...transaction.toObject(),
        visitDate: new Date(transaction.visitDate).toLocaleDateString(),
        grossAmount: transaction.grossAmount.toFixed(2),
        discount: transaction.discount.toFixed(2),
        netAmount: transaction.netAmount.toFixed(2),
        paidAmount: transaction.paidAmount.toFixed(2),
        dueAmount: transaction.dueAmount.toFixed(2)
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=bill_transactions.xlsx'
    );

    // Send the workbook
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting bill transactions:', error);
    res.status(500).json({ message: 'Error exporting bill transactions' });
  }
});

// Create new bill transaction
router.post('/', async (req, res) => {
  const transaction = new BillTransaction(req.body);
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bill transaction
router.patch('/:id', async (req, res) => {
  try {
    const transaction = await BillTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bill transaction
router.delete('/:id', async (req, res) => {
  try {
    await BillTransaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 