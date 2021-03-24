var mongoose=require('mongoose');
 var requires=new mongoose.Schema({
    symptoms: String,
    date : Date,
    time:String
 });

 module.exports=requires;
