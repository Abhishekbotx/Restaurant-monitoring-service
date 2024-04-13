const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  day: { type: Number, min: 0, max: 6 },
  start_time_local: { type: String, required: true },
  end_time_local: { type: String, required: true }
});

module.exports = mongoose.model('BusinessHours', businessHoursSchema);
