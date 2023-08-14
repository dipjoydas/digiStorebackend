const mongoose = require('mongoose');

const { Schema ,model } = mongoose;
const FPSchema = new Schema({
    ids:[]
})
const FP =new model('FP',FPSchema)
module.exports  = FP