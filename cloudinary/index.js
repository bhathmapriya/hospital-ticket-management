var cloudinary=require('cloudinary').v2;
var {CloudinaryStorage}= require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dpcz7adk2',
    api_key: '482833768459481',
    api_secret: 'sv7EzSuzfDErGveJKcd5_U2rfms'
});

var storage= new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'TRS',
    allowedFormats: ['jpeg','jpg','png','gif']}
});

module.exports={cloudinary,storage}