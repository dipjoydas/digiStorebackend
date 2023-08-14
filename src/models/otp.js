const mongoose = require('mongoose')
const {Schema,model } = mongoose
const otpSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    email :String ,
    otp:Number
})
const Otp = model('Otp',otpSchema)
Otp.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds:120 })
module.exports = Otp