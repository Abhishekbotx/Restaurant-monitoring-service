const dotenv=require('dotenv')

dotenv.config();

module.exports={
    DataBaseURL:process.env.Database_URL,
    DataBaseURL2:process.env.Database_URL2,
    PORT:process.env.PORT,
    
}