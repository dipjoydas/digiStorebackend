const mongoose = require('mongoose')
const {Schema,model} = mongoose
const imgSchema = new Schema({
    img:Buffer
    
})
const sliderImage = new model("Sliderimg",imgSchema)
module.exports = sliderImage