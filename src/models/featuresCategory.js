const mongoose = require('mongoose');

const { Schema ,model } = mongoose;
const FcSchema = new Schema({
    des:String ,
    url:String ,
    img:String 
})
const FC =new model('FC',FcSchema)
module.exports  = FC