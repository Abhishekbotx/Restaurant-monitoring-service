const mongoose=require('mongoose')
const storeUptimeDowntimeSchema = new mongoose.Schema({
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    uptime_last_hour: { type: Number, required: true },
    uptime_last_day: { type: Number, required: true },
    uptime_last_week: { type: Number, required: true },
    downtime_last_hour: { type: Number, required: true },
    downtime_last_day: { type: Number, required: true },
    downtime_last_week: { type: Number, required: true }
  });


  module.exports = mongoose.model('StoreUptimeDowntime', storeUptimeDowntimeSchema);
