var mongoose=require('mongoose');
 var requires=new mongoose.Schema({
    symptoms: String,
    department:String,
    date : Date,
    time:String,
    status:String,
    patientId: String
 });

 module.exports=requires;
