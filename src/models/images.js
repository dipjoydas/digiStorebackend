const mongoose = require('mongoose')
const {Schema,model} = mongoose
const imgSchema = new Schema({
    img:Buffer
    
})
const Image = new model("Image",imgSchema)
module.exports = Image