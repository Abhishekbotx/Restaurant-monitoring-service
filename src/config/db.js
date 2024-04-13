const mongoose=require('mongoose');
const {DataBaseURL,DataBaseURL2}=require('./dotenvConfig')

exports.connect = () => {
    mongoose.connect(DataBaseURL2)
    .then(() => {
        console.log("Database Connection established")
    })
    .catch((err) => {

        console.log(err)
        console.log("Connection Issues with Database");
        process.exit(1);
    })
}
 