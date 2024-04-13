const mongoose = require('mongoose');

const timeZoneSchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  timezone: { type: String, required: true }
});

module.exports = mongoose.model('Timezone', timeZoneSchema);
