const StoreActivity = require('../models/storeActivity'); 
const moment=require('moment-timezone')
const calculateUptimeLastDay = async (storeId) => {
  try {
    const lastDayTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000);


    const storeActivityLastDay = await StoreActivity.find({
      store_id: storeId,
      timestamp_utc: { $gte: lastDayTimestamp },
      status: 'active' 
    })

    
    const uptimeLastDayMinutes = storeActivityLastDay.length * 15; 

    return uptimeLastDayMinutes;
  } catch (error) {
    console.error('Error calculating uptime last day:', error);
    throw error;
  }
};

const calculateUptimeLastHour = async (storeId) => {
  try {
    const currentTime = moment();
    const lastHourTimestamp = currentTime.subtract(1, 'hours');

    const storeActivityLastHour = await StoreActivity.find({
      store_id: storeId,
      timestamp_utc: { $gte: lastHourTimestamp.clone().utc() },
      status: 'active' 
    });

   
    const uptimeLastHourMinutes = storeActivityLastHour.length * 15; 
    return uptimeLastHourMinutes;
  } catch (error) {
    console.error('Error calculating uptime last hour:', error);
    throw error;
  }
};

const calculateUptimeLastWeek = async (storeId) => {
  try {
    const moment = require('moment');
    const lastWeekTimestamp = moment().subtract(7, 'days').valueOf();

    const storeActivityLastWeek = await StoreActivity.find({
      store_id: storeId,
      timestamp_utc: { $gte: lastWeekTimestamp },
      status: 'active' 
    });


    const uptimeLastWeekMinutes = storeActivityLastWeek.length * 15; 

    return uptimeLastWeekMinutes;
  } catch (error) {
    console.error('Error calculating uptime last hour:', error);
    throw error;
  }
};

const calculateDowntimeLastDay = async (storeId) => {
  try {
    const totalMinutesInDay = 24 * 60; 
    const uptimeLastDayMinutes = await calculateUptimeLastDay(storeId);
    const downtimeLastDayMinutes = totalMinutesInDay - uptimeLastDayMinutes;

    const downtimeLastDayHours = downtimeLastDayMinutes / 60;

    return downtimeLastDayHours;
  } catch (error) {
    console.error('Error calculating downtime last day:', error);
    throw error;
  }
};

const calculateDowntimeLastHour = async (storeId) => {
  try {
    const totalMinutesInHour = 60; 
    const uptimeLastHourMinutes = await calculateUptimeLastHour(storeId);
    const downtimeLastHourMinutes = totalMinutesInHour - uptimeLastHourMinutes;

    const downtimeLastHourHours = downtimeLastHourMinutes / 60;

    return downtimeLastHourHours;
  } catch (error) {
    console.error('Error calculating downtime last hour:', error);
    throw error;
  }
};

const calculateDowntimeLastWeek = async (storeId) => {
  try {
    const totalMinutesInWeek = 7 * 24 * 60;
    const uptimeLastWeekMinutes = await calculateUptimeLastWeek(storeId);
    const downtimeLastWeekMinutes = totalMinutesInWeek - uptimeLastWeekMinutes;

    const downtimeLastWeekHours = downtimeLastWeekMinutes / 60;

    return downtimeLastWeekHours;
  } catch (error) {
    console.error('Error calculating downtime last week:', error);
    throw error;
  }
};

module.exports = {
  calculateUptimeLastDay,
  calculateUptimeLastHour,
  calculateDowntimeLastDay,
  calculateDowntimeLastHour,
  calculateDowntimeLastWeek
}