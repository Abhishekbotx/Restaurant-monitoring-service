const mongoose = require('mongoose');

const storeActivitySchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: true,
    ref: 'Store',
  },
  timestamp_utc: { type: Date, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model('StoreActivity', storeActivitySchema);
