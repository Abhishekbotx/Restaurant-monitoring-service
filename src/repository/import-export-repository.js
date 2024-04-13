const BusinessHours = require('../models/businessHours');

const insertBusinessHours = async (data) => {
    try {
        const hello=await BusinessHours.insertMany(data);
        console.log(hello)
        
    } catch (error) {
        console.error('Error inserting business hours:', error);
        throw error; // Rethrow the error to be caught in the service layer
    }
};

const getAllBusinessHours = async () => {
    try {
        return BusinessHours.find({});
    } catch (error) {
        console.error('Error getting all business hours:', error);
        throw error; // Rethrow the error to be caught in the service layer
    }
};

module.exports = { insertBusinessHours, getAllBusinessHours };