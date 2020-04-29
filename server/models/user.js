//Schema for mongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Object properties 
const userSchema  = new Schema({ 
    username: String ,
    password: String, 
    role: String,
    token: String
});

module.exports = mongoose.model('User', userSchema) //defining a collection that will have a userSchema object with some defined properties