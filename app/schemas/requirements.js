var mongoose=require('mongoose');
 var requires=new mongoose.Schema({
    symptoms: String,
    date : Date,
    time: Number
 });

 module.exports=requires;
