const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    store_name: { type: String, required: true,},
    store_Address: { type: String, required: true },
    opening_time: { type: String, required: true }, 
    closing_time: { type: String, required: true }, 
    timezone: { type: String, required: true },
    open_days: [{ type: Number, min: 0, max: 6 }] , 
    isActive: { type: Boolean, default: true } 
}); 

module.exports = mongoose.model('Store', storeSchema);
