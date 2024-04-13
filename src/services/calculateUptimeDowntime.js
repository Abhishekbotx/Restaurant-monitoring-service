const moment = require('moment-timezone');
const { BusinessHours } = require('../models/businessHours');
const { StoreActivity } = require('../models/storeActivity');


async function calculateUptimeDowntime(storeId, startTime, endTime, timezone) {
    try {
     
      const businessHours = await BusinessHours.find({ store_id: storeId });
      
     
      console.log('Retrieved Business Hours:', businessHours);
  
      
      const timezoneStr = timezone ? timezone : 'America/Chicago';
      
      
      const startTimeUTC = moment(startTime).tz(timezoneStr).startOf('day').toDate();
      const endTimeUTC = moment(endTime).tz(timezoneStr).endOf('day').toDate();
  
 
      let uptimeLastHour = 0;
      let uptimeLastDay = 0;
      let uptimeLastWeek = 0;
      let downtimeLastHour = 0;
      let downtimeLastDay = 0;
      let downtimeLastWeek = 0;
  
    
      for (let currentTime = moment(startTimeUTC); currentTime.isBefore(endTimeUTC); currentTime.add(1, 'hour')) {
        
        const currentHourStart = currentTime.clone().startOf('hour');
        const currentHourEnd = currentTime.clone().endOf('hour');
  
        
        const currentDayOfWeek = currentHourStart.day();
        const businessHour = businessHours.find(hour => hour.dayOfWeek === currentDayOfWeek);
        

        if (businessHour) {
          const businessHourStart = moment.tz(currentHourStart.format('HH:mm:ss'), 'HH:mm:ss', timezoneStr).toDate();
          const businessHourEnd = moment.tz(currentHourEnd.format('HH:mm:ss'), 'HH:mm:ss', timezoneStr).toDate();
          

          const storeActivity = await StoreActivity.findOne({
            store_id: storeId,
            timestamp_utc: { $gte: currentHourStart.toDate(), $lt: currentHourEnd.toDate() }
          });
          

          if (storeActivity && storeActivity.status === 'active') {
            uptimeLastHour++;
          } else {
            downtimeLastHour++;
          }
        }
      }
  

      for (let i = 0; i < 24; i++) {
        const hourAgo = moment(endTimeUTC).subtract(i, 'hours');
        const storeActivity = await StoreActivity.findOne({
          store_id: storeId,
          timestamp_utc: { $gte: hourAgo.startOf('hour').toDate(), $lt: hourAgo.endOf('hour').toDate() }
        });
  
        if (storeActivity && storeActivity.status === 'active') {
          uptimeLastDay++;
        } else {
          downtimeLastDay++;
        }
  
        if (i < 168) { 
          const dayAgo = moment(endTimeUTC).subtract(i, 'days');
          const storeActivity = await StoreActivity.findOne({
            store_id: storeId,
            timestamp_utc: { $gte: dayAgo.startOf('day').toDate(), $lt: dayAgo.endOf('day').toDate() }
          });
  
          if (storeActivity && storeActivity.status === 'active') {
            uptimeLastWeek++;
          } else {
            downtimeLastWeek++;
          }
        }
      }
  

      return {
        uptime_last_hour: uptimeLastHour,
        uptime_last_day: uptimeLastDay,
        uptime_last_week: uptimeLastWeek,
        downtime_last_hour: downtimeLastHour,
        downtime_last_day: downtimeLastDay,
        downtime_last_week: downtimeLastWeek,
      };
    } catch (error) {
      throw new Error(`Error calculating uptime/downtime: ${error.message}`);
      console.log(error);
    }
  }
  
  module.exports = {
    calculateUptimeDowntime,
  };
  