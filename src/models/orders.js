const mongoose = require('mongoose')
const {Schema,model,ObjectId } = mongoose
const ordersSchema = new Schema({
    _id:ObjectId ,
    name:String,
    
    number:String,
    email:String ,
    address:String,
    city:String,
    comment:String,
    price:Number ,
    delivary:String,
    transaction:String ,
    orders:[
        {}
    ],
    timestamp: {
        type:Date,
        default:Date.now
    },
    delivered:{
        type:String,
        default:"notdeliverd"
    }

})
// tempoOrdersSchema.cle
const Orders = model('Order',ordersSchema)
module.exports = Orders