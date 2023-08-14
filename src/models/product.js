const mongoose = require('mongoose')
const { Schema } = mongoose;
const productSchema =new Schema({
    category:[String],
    title:String,
    price:Number,
    oldPrice:Number,
    regularPrice:Number,
    keyFeatures:[String],
    specification:[{}],
    description:String,
    reviews:[
        {
            name:String,
            rating:Number ,
            des:String
        }
    ],
    img:String


})

const Product = mongoose.model('Product',productSchema)
Product.collection.createIndex({title:'text'},(err) => {
    if (err) {
      console.error('Error creating index:', err);
    } else {
      console.log('Index created on the title field.');
    }})
module.exports = Product
// const products =new product({
//     title:'this is big deal'
// })

