var mongoose=require('mongoose');
 var requires=new mongoose.Schema({
    symptoms: String,
    department:String,
    date : Date,
    time:String,
    patientId: String
 });

 module.exports=requires;
