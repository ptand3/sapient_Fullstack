//Schema for mongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Object properties 
const projectSchema  = new Schema({ 
    name: String ,
    owner: String, 
    status: String,
    approved_by :String,
    approval_date : Date
});

module.exports = mongoose.model('Project', projectSchema) 