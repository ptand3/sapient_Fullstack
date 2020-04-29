//Schema for mongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Object properties 
const questionSchema  = new Schema({ 
    question: String ,
    answer: String, 
    priority: String,
    category :String,
});

module.exports = mongoose.model('Question', questionSchema) 