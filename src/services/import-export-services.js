const { insertBusinessHours, getAllBusinessHours } = require('../repository/import-export-repository');
const csv = require('csvtojson');
const CsvParser = require('json2csv').Parser;

const importData = async (filePath) => {
    try {
        const data = await csv().fromFile(filePath);
        const formattedData = data.map(item => ({
            store_id: item.store_id,
            day: item.day,
            start_time_local: item.start_time_local,
            end_time_local: item.end_time_local
        }));
        console.log("before hey")
        const hi=await insertBusinessHours(formattedData);
        console.log(hi);
    } catch (error) {
        console.error('Error importing data:', error);
        throw error; 
    }
};

const exportData = async () => {
    try {
        const data = await getAllBusinessHours();
        const user = data.map(items => ({
            store_id: items.store_id,
            day: items.day,
            start_time_local: items.start_time_local,
            end_time_local: items.end_time_local
        }));
        const csvFields = ['store_id', 'day', 'start_time_local', 'end_time_local'];
        const csvParser = new CsvParser( csvFields );
        return csvParser.parse(user);
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error; 
    }
};

module.exports = { importData, exportData };