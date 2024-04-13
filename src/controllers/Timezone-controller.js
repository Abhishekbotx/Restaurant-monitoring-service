const Timezone=require('../models/Timezone')
const CsvParser=require('json2csv')

const exportTimezone = async (req, res) => {
    try {
        const data = await Timezone.find({});
        const csvFields = ['store_id', 'timezone'];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Timezone.csv');
        res.status(200).send(csvData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};