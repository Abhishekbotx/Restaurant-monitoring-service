const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { importBusinessHours,exportBusinessHours } = require('../controllers/Business-Hours-controller');
const{storeCreate, storeToggleStatus}=require('../controllers/Store-CRelated-controller');
const { findStoreAndPushInActivity } = require('../controllers/Store-Activity-controller');
const { calculateUptimeLastDay, calculateUptimeLastHour, exportStoreUptimeDowntime,exportStoreUptimeDowntimeIndividual } = require('../controllers/Store-Uptime-Downtime-controller');

router.post('/upload', upload.single('file'), importBusinessHours);
router.get('/exportBusiness', exportBusinessHours);
router.post('/Store',storeCreate)
router.post('/push',findStoreAndPushInActivity)
router.post('/pushActive',storeToggleStatus)
router.get('/getlasthour',calculateUptimeLastHour)
router.get('/getlasthourcsv',exportStoreUptimeDowntimeIndividual)
 
module.exports = router;