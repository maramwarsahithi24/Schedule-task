const mongoose = require('mongoose');

async function connectDB(url){
    try{
        await mongoose.connect(url);
        console.log("Mongodb connected successfully");
        return true;
    } catch(error){
        console.log("Mongodb connection error:",error);
    }
}

module.exports = connectDB;