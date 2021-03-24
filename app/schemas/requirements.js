var mongoose=require('mongoose');
 var requires=new mongoose.Schema({
    symptoms: String,
    date : Date,
    time:{
       timestamps:true
    }
 });

 module.exports=requires;
