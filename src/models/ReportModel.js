const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    
    required: true,
    unique: true,
    
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId, 
    type: String,
    required: true,
    ref: 'Store' ,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  reportData: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Complete'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
