const mongoose = require('mongoose')
const {Schema,model } = mongoose
const otpSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 0 },
    email :String ,
    otp:Number
})
const ResetOtp = model('ResetOtp',otpSchema)
module.exports = ResetOtp