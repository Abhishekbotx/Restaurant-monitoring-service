const express = require('express');


const{PORT}=require('./src/config/dotenvConfig')
const router = require('./src/routes/routes');
const app = express();

app.use(express.json())


const {connect}=require('./src/config/db') 

app.use('/', router);

app.listen(PORT, () => {
    connect()
    console.log(`Server is running on http://localhost:${PORT}`);
});