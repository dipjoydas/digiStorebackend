const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const cors = require('cors')
const mongoose =require('mongoose')
const bodyParser = require('body-parser')
const Product = require('../models/product')
const Image =require('../models/images')
const SliderImage = require('../models/sliderImg')
const FeaturedImage = require('../models/featuredImg')
const FCImage = require('../models/fCimg')
const FC = require('../models/featuresCategory')
const FP = require('../models/featuresProduct')
const adminAuth = require('../middleware/adminAuth')
const auth = require('../middleware/auth')

require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const router = express.Router()
router.use(cors())
router.use(express.json())
router.use(bodyParser.urlencoded({ extended: true }))

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})
router.get('/',(req,res)=>{
    res.send("testing")
})

// router.get('/productcategory',(req,res)=>{
//     const category = {
//         'desktop':[{'star pc':['intel','rayzen']},{'gaming pc':['intel','ryzen']},{'brand pc':['acer','dell','lenevo','hp']},{'all in one pc':['dell','lenevo','microsoft','msi']},{'portable mini pc':['asus','hp']},'apple mac pc','show all desktop'],
//         'laptop':[{'all laptop':['ausu','acer','dell','gigabyte','hp','lenevo','msi']},{'gaming laptop':['razer','hp','asus','msi','gigabyte','acer','lenevo']},'show all laptop'],
//         'component':[{'processor':['amd','intel']},{'cup cooler':['antec',';lian li','noctua']},{'ram':['team','zadak','corsir','gigabyte','g.skill']}],
//         'monitor':['acer','msi','apple','lg','asus','beng','hp'],
//         'ups':[{'mini ups':['marsriva','ske','wge']},{'ups battery':['maxgreen','santak','leoch','long','apollo']},'show all ups'],
//         'phone':['apple','samsung','google','motorola','oneplus','oppo','vivo','realme','infinix','nokia'],
//         'table':[{'graphs table':['xp ped','huion','wacom','veikk','wiwu']},'apple','amazon','lenevo','samsung','realme','xioami','huawel','show all table'],
//         'office equipment':'',
//         'camera':'',
//         'security':'',
//         'networinking':'',
//         'software':'',
//         'server and storage':'',
//         'accessories':'',
//         'gadget':'',
//         'gaming':'',
//         'tv':'',
//         'ac':'',


// }
//     res.json(category)
// })
router.get('/homeslider',async(req,res)=>{
    const sliderImgesId =await SliderImage.find({}).select("_id")
    const idString = []
    sliderImgesId.forEach(element => {
       const id = element.id.toString()
       idString.push(id)
        
    });
    res.json(idString)
})

router.get('/featuredimages',async(req,res)=>{
    const FeaturedImageId =await FeaturedImage.find({}).select("_id")
    const idString = []
    FeaturedImageId.forEach(element => {
       const id = element.id.toString()
       idString.push(id)
        
    });
   
    res.json(idString)
})




router.post('/uploadsliderimg', adminAuth,upload.array("images",3),async(req,res)=>{
    await SliderImage.deleteMany({})
    req.files.map(async(file)=>{
        const sliderimg = new SliderImage({img:file.buffer})
        await sliderimg.save()
    })
    res.send({result : "suceess"})

})

router.post('/uploadfeaturedimg',adminAuth,upload.array("images",3),async(req,res)=>{
    await FeaturedImage.deleteMany({})
    req.files.map(async(file)=>{
        const sliderimg = new FeaturedImage({img:file.buffer})
        await sliderimg.save()
    })
    res.send({result : "suceess"})

})

router.post('/updateslider',adminAuth,(req,res)=>{

})
router.get('/featurescategory',async(req,res)=>{
    const fc = await FC.find({})

    
    res.json(fc)
})


router.get('/featuresproduct',async(req,res)=>{
    
   
    
    const ids = await FP.findOne({})
    
    if(ids == null){
        res.send([])
    }else{
    // const {_id , category , title , price , oldPrice , regularPrice , keyFeatures , specificaton , description , reviews , img } =data
    const response = await Product.find({_id:{$in:ids.ids}}).select({title:1,price:1,oldPrice:1,keyFeatures:1,img:1})
    res.send(response)
    }
   

})


router.post('/addfeaturesprodct',adminAuth,async(req,res)=>{
    try{
      const findFP = await FP.findOne({})
      if(Boolean(findFP)){
        // first filter ids if ids alreasy exist then not add to db 
        const ids = req.body
        const filterIds = []
        const findIdsDB = findFP.ids 
        ids.map(id=>{
            const index = findIdsDB.indexOf(id)
            if(index == -1){
                filterIds.push(id)
            }
        })
        findFP.ids = [...findFP.ids,...filterIds]
        await findFP.save()
    //    console.log(findFP,'findsproduct')
       res.send({result:"sucess"})
      }else{
       const  fp = new FP({ids:req.body})
         await fp.save()
         res.send({result:"sucess"})
        
      }
      

    }catch(error){
        console.log(error)
    }
    
})

router.delete('/removefeaturesprodct',adminAuth,async(req,res)=>{
    try{
        const findFP = await FP.findOne({})
        const DBIds = findFP.ids
        // findFP.ids = 
        const ids = req.body
        let filterIds =DBIds
        ids.map(id=>{
          const filter =  filterIds.filter((DBId)=>{
                return DBId !==id
            })
            
            filterIds = filter


        })
        findFP.ids = filterIds
        await findFP.save()
        res.send({result:"sucess"})


    }catch(error){
        console.log(error)

    }


})
// router.get('/product/*',(req,res)=>{
//     console.log(req.originalUrl)
//     res.send('done')
// })

router.post('/addproduct',adminAuth,async(req,res)=>{
    const product = new Product(req.body)
  const ress = await product.save()
   res.send(ress)



})

router.post('/addfeaturescategory',adminAuth,async(req,res)=>{
    const fC = new FC(req.body)
  const ress = await fC.save()
   res.send(ress)



})
// update product -------------------------------------

router.put('/updateproduct/:id',adminAuth,async(req,res)=>{
    const product = req.body
    const response = await Product.findByIdAndUpdate(req.params.id ,product ,{new:true} )
    res.send(response._id)
})
// get products route 
router.get('/getproducts/*',async(req,res)=>{
    const path = req._parsedUrl.pathname
    
   const pathArray =  path.split('/')
   pathArray.splice(0,2)
   const show = req.query.show
   const skip = req.query.skip
   
   
    // count total document length -----------------

 const count = await Product.countDocuments({category:{$all:pathArray}})
 

const product = await Product.find({category:{$all:pathArray}}).skip(skip*show).limit(show).select({title:1,price:1,oldPrice:1,keyFeatures:1,img:1})
    // console.log(req)
    res.send({product,count})
    // res.send('done')
})
//--------------------------------------------------- get specific product ---------------------
router.get('/product/:id',async(req,res)=>{
    // first check if id is valid mongodb ojbect id otherwise it will send error and server will be crushed 
   
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }
            const product = await Product.findById(req.params.id)
            res.send(product)

    }catch(error){
       
    }
   
})

router.put('/addreview/:id' ,auth ,async(req,res)=>{
    const id = req.params.id 
    const review =req.body
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const update = await Product.findById(id)
    update.reviews.push(review)
    res.send({result:"success"})
     await update.save()
} )



//---------------------------------------------------------------- add images to db -------------------------------------------


router.post('/addimage',adminAuth,upload.single('image'),async(req,res)=>{
    const buffer = await sharp(req?.file?.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const img = new Image({
        img:buffer
    })
    const result = await img.save()
    res.send(result._id)
})

router.post('/addfeaturescategoryimage',adminAuth,upload.single('image'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const img = new FCImage({
        img:buffer
    })
    const result = await img.save()
    res.send(result._id)
})

router.put('/updateimage/:id',adminAuth,upload.single('image'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
   const response = await Image.findByIdAndUpdate(req.params.id , {img:buffer} ,{new:true})
   res.send(response._id)



    
})


//------------------------------------------------------ get images ----------------------------------------------------

router.get('/getimage/:id',async(req,res)=>{
   
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const img =await Image.findById(req.params.id)
   
    res.set('Content-Type', 'image/png')
   
    res.send(img.img)
})
router.get('/getsliderimage/:id',async(req,res)=>{
  
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const img =await SliderImage.findById(req.params.id)
    // console.log(img)
    res.set('Content-Type', 'image/png')
    // res.set('Content-Type','image/png')
    res.send(img.img)
})
router.get('/getfeaturedimage/:id',async(req,res)=>{
  
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const img =await FeaturedImage.findById(req.params.id)
    // console.log(img)
    res.set('Content-Type', 'image/png')
    res.send(img.img)
})
router.get('/getfcimage/:id',async(req,res)=>{ 
  
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const img =await FCImage.findById(req.params.id)
    // console.log(img)
    res.set('Content-Type', 'image/png')
    // res.set('Content-Type','image/png')
    res.send(img.img)
})
//--------------------------------------------------------- delete product -------------------------------------------------

router.delete('/product/delete',adminAuth,async(req,res)=>{
   const p = await Product.findByIdAndDelete(req.body._id)
   const pImg = await Image.findByIdAndDelete(req.body.img)
   res.send(result)
})

router.delete('/fcategory/delete',adminAuth,async(req,res)=>{
   const fc = await FC.findByIdAndDelete(req.body._id)
   const fcimage = await FCImage.findByIdAndDelete(req.body.img)
//    res.send(result)
// console.log(req.body,'params ')
res.send({result:"success"})
})

// ---------------------------------------------------payment router -------------------------------------------------------
router.post('/create-payment-intent', async (req, res) => {
    try{
        const paymentInfo = req.body;
    const amount = paymentInfo.price * 100;
    // console.log(payment)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
        
        
    });
    res.json({ clientSecret: paymentIntent.client_secret })

    }catch(error){
        console.log(error)

    }
    
})
//  ----------------------------------------------------------------- product search-------------------------------------------------------
router.get('/productsearch',async(req,res)=>{
    // console.log(req.query)
    const searchValue = req.query.search
    const products = await Product.find({$text:{$search: searchValue}}).limit(7)
    res.send(products) 
}) 

router.post('/getrvp',async(req,res)=>{
    const ids =  req.body
    const response = await Product.find({_id:{$in:ids}}).select({title:1,price:1,img:1})

    res.send(response)
})


// router.post('/create-payment-intent',async (req,res)=>{
//     const session = await stripe.checkout.session.create({
//         payment_method_types:["card"],
//         mode:"payment",
//         line_items:req.body.items.map()
//     })
// })

// router.post('/create-payment-intent', async (req, res) => {
//     const paymentInfo = req.body;
//     const amount = paymentInfo.price * 100;
//     // console.log(payment)
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: 'usd',
        
        
//     });
//     res.json({ clientSecret: paymentIntent.client_secret })
// })
module.exports =router