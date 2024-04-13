const moment = require('moment'); 
const StoreActivity = require('../models/storeActivity');
const cron=require('node-cron')
const Store=require('../models/store.js')



const findStoreAndPushInActivity=async(req,res)=>{
  cron.schedule('*/1 * * * *',async()=>{
      try {

          const response=await Store.find({})
          response.map((item)=>{
            const openingTime = moment(item.opening_time, 'HH:mm');
            const closingTime = moment(item.closing_time, 'HH:mm');
            PushStoreActivity({
                  _id:item._id,
                  isActive:item.isActive,
                  openingTime:openingTime,
                  closingTime:closingTime
              })
          })

          res.json({
            success:true
          })
      } catch (error) {
          throw error
      }
  })
}





const PushStoreActivity = async (data) => {
  try {
    const storeActivityData = data.isActive;
    const Status = storeActivityData === true ? 'active' : 'inactive';

    const openingTime = data.openingTime;
    const closingTime = data.closingTime;
    const currentTime = moment();
    console.log(currentTime)
    const isActiveTime = currentTime.isAfter(openingTime) && currentTime.isBefore(closingTime);
    console.log(isActiveTime)
    let store; 

    if (isActiveTime) {
       store = await StoreActivity.create({
        store_id: data._id, 
        timestamp_utc: currentTime.clone().utc(),
        status: Status
      });
    }

    console.log('Store activity data fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing store activity data:', error);
  }
};



const exportStoreActivity = async (req, res) => {
    try {
        const data = await StoreActivity.find({});
        const csvFields = ['store_id', 'timestamp_utc', 'status'];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=StoreActivity.csv');
        res.status(200).send(csvData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports={findStoreAndPushInActivity,PushStoreActivity,exportStoreActivity}


