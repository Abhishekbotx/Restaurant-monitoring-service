const BusinessHours = require('../models/BusinessHours');
const StoreUptimeDowntime = require('../models/StoreUptimeDowntime');
const Store = require('../models/store');
const StoreActivity = require('../models/storeActivity'); 
const moment=require('moment-timezone')

const CsvParser = require('json2csv').Parser


const exportStoreUptimeDowntime = async (req, res) => {
    try {
        const data = await StoreUptimeDowntime.find({});
        const csvFields = ['store_id', 'uptime_last_hour', 'uptime_last_day', 'uptime_last_week', 'downtime_last_hour', 'downtime_last_day', 'downtime_last_week'];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=StoreUptimeDowntime.csv');
        res.status(200).send(csvData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const exportStoreUptimeDowntimeIndividual = async (req, res) => {
  try {
    const { store_id } = req.body;

    const uptimeLastHourMinutes = await calculateUptimeLastHour(store_id);
    const downtimeLastHourMinutes = 60 - uptimeLastHourMinutes;

    const { uptimeLastDayHours, downtimeLastDayHour, TotalhrsInaDay } = await calculateUptimeDowntimeLastDayInHours(store_id);
    console.log(uptimeLastDayHours,downtimeLastDayHour,TotalhrsInaDay)
    const uptimehours=uptimeLastDayHours;
    const downtime=downtimeLastDayHour
    const { uptimeHoursLastWeek, downtimeHoursLastWeek } = await calculateUptimeDowntimeLastWeekInHours({ store_id, TotalhrsInaDay });
    console.log(uptimeHoursLastWeek)
    console.log(uptimeHoursLastWeek)
    const csvFields = ['store_id', 'uptime_last_hour', 'uptime_last_day', 'uptime_last_week', 'downtime_last_hour', 'downtime_last_day', 'downtime_last_week'];
    const csvParser = new CsvParser({ fields: csvFields });
    
    const data = [
      {
        store_id: store_id,
        uptime_last_hour: uptimeLastHourMinutes,
        uptime_last_day: uptimehours || 0, 
        uptime_last_week: uptimeHoursLastWeek || 0, 
        downtime_last_hour: downtimeLastHourMinutes,
        downtime_last_day: downtime || 0, 
        downtime_last_week: downtimeHoursLastWeek || 0 
      }
    ];
    Promise.all(data)

    if (data.length > 0) {
      const csvData = csvParser.parse(data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=StoreUptimeDowntime.csv');
      res.status(200).send(csvData);
    } else {
      res.status(400).json({ success: false, error: 'Data is empty' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};




 const calculateUptimeDowntimeLastDayInHours = async (storeId) => {
  try {

    const currentTime = moment();
    const lastDayTimestamp = currentTime.clone().subtract(1, 'days');
    const storeActivityLastDay = await StoreActivity.find({
      store_id: storeId,
      timestamp_utc: { $gte: lastDayTimestamp },
      status: 'active'
    });
    
    const uptimeLastDayMinutes = storeActivityLastDay.length * 15;
    const uptimeLastDayHours = uptimeLastDayMinutes / 60;

    const store = await Store.findOne({ _id: storeId });

    const opening_time = store?.opening_time || '00:00'; 
    const closing_time = store?.closing_time || '00:00'; 

    const openingHour = parseInt(opening_time.split(':')[0]);
    const closingHour = parseInt(closing_time.split(':')[0]);

    const TotalhrsInaDay = closingHour - openingHour;
    console.log('TotalhrsInaDay in lastdaycal:',TotalhrsInaDay)
    const downtimeLastDayHour = TotalhrsInaDay - uptimeLastDayHours;
    console.log('uptimeLastDayHours:',uptimeLastDayHours,'downtimeLastDayHour:',downtimeLastDayHour)
    return { uptimeLastDayHours, downtimeLastDayHour,TotalhrsInaDay };
  } catch (error) {
    console.error('Error calculating uptime last day:', error);
    throw error;
  }
};



const calculateUptimeLastHour = async (storeId) => {
  try {
    const currentTime = moment();
    const lastHourTimestamp = currentTime.clone().subtract(1, 'hours');
    console.log(lastHourTimestamp,currentTime)
    const storeActivitiesLastHour = await StoreActivity.find({
      store_id: storeId,
      timestamp_utc: { $gte: lastHourTimestamp },
      status: 'active'
    });
 
    console.log(storeActivitiesLastHour.length)

   
    const uptimeLastHourMinutes = storeActivitiesLastHour.length * 15; 
    return uptimeLastHourMinutes;
  } catch (error) {
    console.error('Error calculating uptime last hour:',);
    throw error;
  }
};

const calculateUptimeDowntimeLastWeekInHours = async (data) => {
  try {
    
    const currentTime = moment();
    const lastWeekTimestamp = currentTime.clone().subtract(7, 'days');
    console.log(currentTime,lastWeekTimestamp)
    const storeActivityLastWeek = await StoreActivity.find({
      store_id: data.store_id,
      timestamp_utc: { $gte: lastWeekTimestamp },
      status: 'active'
    });

    const activetimeinMinutes=storeActivityLastWeek.length*15
    console.log(storeActivityLastWeek)
    console.log('activetimeinMinutesIn week:',activetimeinMinutes)

    const store = await Store.findOne({_id:data.store_id});
    // console.log(store)
    if (store && store.opening_time && store.closing_time && store.open_days.length > 0) {
      const openingTime = store.opening_time;
      const closingTime = store.closing_time;                     
      const activeDays = store.open_days.length;
      console.log('activedays:',activeDays)

      
      const totalActiveHoursLastWeek = data.TotalhrsInaDay * activeDays;
      console.log('TotalhrsInaweek:',totalActiveHoursLastWeek)
      let uptimeHoursLastWeek = 0;
      let downtimeHoursLastWeek = 0;

      if (storeActivityLastWeek && storeActivityLastWeek.length > 0) {
        const uptimeLastWeekMinutes = storeActivityLastWeek.length * 15;
        uptimeHoursLastWeek = uptimeLastWeekMinutes / 60;
        console.log('uptimeastweekhours:',uptimeHoursLastWeek)
      }

      downtimeHoursLastWeek = totalActiveHoursLastWeek - uptimeHoursLastWeek;
      console.log('downtimeHoursLastWeek:',downtimeHoursLastWeek)
      return { uptimeHoursLastWeek, downtimeHoursLastWeek };
    } else {
      return { uptimeHoursLastWeek: 0, downtimeHoursLastWeek: 0 };
    }
  } catch (error) {
    console.error('Error calculating uptime last week:', error);
    throw error;
  }
};

 
 




module.exports = {
  calculateUptimeLastHour,
  exportStoreUptimeDowntime,
  exportStoreUptimeDowntimeIndividual
}
