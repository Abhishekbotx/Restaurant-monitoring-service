const StoreUptimeDowntime = require('../models/StoreUptimeDowntime')
const BusinessHours=require('../models/BusinessHours')
const csv = require('csvtojson')
const CsvParser = require('json2csv').Parser

const importBusinessHours = async (req, res) => {
    try {
        const data = []

        csv()
            .fromFile(req.file.path)
            .then((response) => {
                response.forEach((item) => {
                    data.push({
                        store_id: item.store_id,
                        dayOfWeek: item.day,
                        start_time_local: item.start_time_local,
                        end_time_local: item.end_time_local
                    })
                })

                BusinessHours.insertMany(data)
            })

        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: "false" });

    }
}


const exportBusinessHours = async (req, res) => {
    const user = []
    const data = await BusinessHours.find({});

    data.forEach((items) => {
        const { store_id, day, start_time_local, end_time_local } = items
        user.push({ store_id, day, start_time_local, end_time_local })
    })


    const csvFields = ['store_id', 'day', 'start_time_local', 'end_time_local']
    const csvParser = new CsvParser({ csvFields })
    const csvData = csvParser.parse(user);

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment: filename=userData.csv')

    res.status(200).send(csvData);

}

module.exports = {
    importBusinessHours, 
    exportBusinessHours, 
    
}