const mongoose = require('mongoose')
const {Schema,model} = mongoose
const imgSchema = new Schema({
    img:Buffer
    
})
const FeaturedImage = new model("Featuredimg",imgSchema)
module.exports = FeaturedImage