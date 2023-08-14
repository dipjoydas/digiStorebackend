const mongoose = require('mongoose')
const {Schema,model} = mongoose
const imgSchema = new Schema({
    img:Buffer
    
})
const FCImage = new model("FCImg",imgSchema)
module.exports = FCImage