const express = require('express')
const mongoose = require('mongoose')
const TempoOrders = require('../models/tempoOrders')
const Orders = require('../models/orders')
const auth = require('../middleware/auth')
const cors = require('cors')
const router = express.Router()

router.use(express.json())
const allowedOrigins = ['https://digi-store.netlify.app', 'https://digistoreadmin.netlify.app/'];

router.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

router.post('/addtemporaryorder', auth, async (req, res) => {
    // const order = req.body 
    const order = new TempoOrders(req.body)
    try {
        await order.save()
        // console.log(order._id.toString())
        const id = order._id.toString()
        res.status(201).send({ id })

        // res.send(id)

    } catch (error) {
        res.status(400).send(error)

    }

})
router.get('/gettempoorder/:id', auth, async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const response = await TempoOrders.findById(id)
    res.send(response)
})
router.put('/updateorderbackend/:id', async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });

    }
    const order = req.body
    const response = await Orders.findByIdAndUpdate({ _id: id }, { $set: { delivered: "deliverd" } }, { new: true })
   
    res.send(response)
})
router.put('/updateorder/:id', auth, async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });

    }
    const order = req.body
    delete order.expiresAt
    const orderModified = new Orders(order)
    await orderModified.save()
    await TempoOrders.findByIdAndDelete(id)
    res.send({ result: 'done' })
})
router.get('/orders',auth, async (req, res) => {
    const userEmail = req.user?.email


    // console.log(userEmail.toString())
    try {
        const response = await TempoOrders.find({ 'email': userEmail }).select({orders:1})
        res.send(response)

    } catch (error) {
        console.log(error)


    }

})
router.get('/getfilterorders', async (req, res) => {
    const startDate = req.query.startdate
    const endDate = req.query.enddate
    const delivered = req.query.delivered
    if ((startDate == undefined) && (endDate == undefined)&&(Boolean(delivered))) {
        const response = await Orders.find({ delivered:delivered})
        res.send(response)

        

    }
    if ((startDate != undefined) && (endDate != undefined) && (delivered != undefined)) {
  
        const response = await Orders.find({ timestamp: { $gte: startDate, $lte: endDate }, delivered: delivered })
        res.send(response)

      

    }
    if((startDate == undefined) && (endDate == undefined) && (delivered == undefined)){
        const response = await Orders.find({}).limit(5)
            res.send(response)
   
           

    }

})




router.get('/orderhistory',auth ,async(req,res)=>{
    const email = req.user.email
    const response =await Orders.find({email:email}).sort({timestamp:-1})
    res.send(response)


})





module.exports = router