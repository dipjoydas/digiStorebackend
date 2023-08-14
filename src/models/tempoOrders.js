const mongoose = require('mongoose')
const { Schema } = mongoose;
const tempoOrdersSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    name:String,
    
    number:String,
    email:{
        type: String,
        trim: true,
    } ,
    address:String,
    city:String,
    comment:String,
    price:Number ,
    delivary:String,
    transaction:String ,
    orders:[
        {}
    ]
})
// tempoOrdersSchema.cle
const TempoOrders = mongoose.model('Temporaryorder',tempoOrdersSchema)
TempoOrders.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds:600 })
module.exports = TempoOrders