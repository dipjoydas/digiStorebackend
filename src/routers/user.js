const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = express.Router()
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const User = require('../models/user')
const Admin = require('../models/admin')
const Otp = require('../models/otp')
const ResetOtp = require('../models/resetOtp')
const {sendOtp,sendResetOtp} = require('./sendMail')
// console.log(sendOtp,sendResetOtp,'sendotp and resend otp')
const allowedOrigins = ['https://digi-store.netlify.app/', 'https://digistoreadmin.netlify.app/'];
router.use(cors())

// router.use(cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     }
//   }));
router.use(express.json())


router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
      
        // now send  send a opt to verify email address 
        // generate opt ------------------------------------------------------------------
        const otpgen = ()=>{
            let otp = Math.floor(Math.random()*1000000)
           
            if(otp.toString().length != 6){
                otpgen()
            }
            return otp
        }
        const otp = otpgen()
        // now store opt to db and to send to mail 
        const storeOtp = async()=>{
            const otpObj = {
                expiresAt: new Date(Date.now() + 60 * 2 * 1000),
                // expires after 2 minutes from current time
                email:req.body.email ,
                otp:otp
            }
            const otpModel = new Otp(otpObj)
            await otpModel.save()
            //-------------------------------------------- send otp to mail ---------------------------------------
            sendOtp(otp,req.body.email)



        }
        
        storeOtp()



        // res.status(201).send({ user, token })
        res.status(201).send({ result:"success" })
       
    } catch (error) {
        res.status(400).send(error)
    }

})
router.post('/resendopt',async(req,res)=>{
    try{
        const otpgen = ()=>{
            let otp = Math.floor(Math.random()*1000000)
           
            if(otp.toString().length != 6){
                otpgen()
            }
            return otp
        }
        const otp = otpgen()
        const storeOtp = async()=>{
            const otpObj = {
                expiresAt: new Date(Date.now() + 60 * 2 * 1000),
                // expires after 2 minutes from current time
                email:req.body.email ,
                otp:otp
            }
            const otpModel = new Otp(otpObj)
            await otpModel.save()
            //-------------------------------------------- send otp to mail ---------------------------------------
            sendOtp(otp,req.body.email)
    
    
    
        }
        
        storeOtp()
        res.send({result:"success"})

    }catch(error){
        res.send({result:error.message})

    }
  


})
router.post('/verifyemail',async(req,res)=>{
    const {otpValue,email} = req.body
   
    const otpFind = await Otp.find({'email':email})
    if( otpFind[otpFind.length -1]?.otp == otpValue){
        // const user = await User.updateOne({email:email},{status:'active'}, { new: true })
        const user = await User.findOne({'email':email})
        const token = await user.generateAuthToken()
        const Updateuser = await User.updateOne({email:email},{status:'active'}, { new: true })
      


        
        res.status(201).send({user , token })
    }
})
router.get('/getuser', auth, (req, res) => {
    const user = req.user
    res.send(user)
})
// router.get('/admindefault',async(req,res)=>{
//    const admin = new Admin({
//     email:"dipjoy488@gmail.com",
//     password:"1234567"
//    })
//    await admin.save()

//     res.send(admin)
// })
router.get('/getadmin', adminAuth, (req, res) => {
    const admin = req.admin
    res.send(admin)
})
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(user,'from log in route')
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({msg:e.message})
      
    }
})
// admin log in 

router.post('/adminlogin', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
       
     
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send({msg:e.message})
     
    }
})




router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({ result: "success" })
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/adminlogout', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()

        res.send({ result: "success" })
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/changepassword',auth,async(req,res)=>{
    const {currentPassword,newPassword} = req.body
    // const user = req.user
    try{
        const email = req.user.email 
    const user = await User.findByCredentials(email, currentPassword)
    user.password = newPassword
    await user.save()
    res.send({result:"password change successfully"})

    }catch(e){
        res.status(400).send({result:"unabe to change password"})
    }
    


})
router.post('/changeadminpassword',adminAuth,async(req,res)=>{
    const {currentPassword,newPassword} = req.body
    // const user = req.user
    try{
        const email = req.admin.email 
    const admin = await Admin.findByCredentials(email, currentPassword)
    admin.password = newPassword
    await admin.save()
    res.send({result:"password change successfully"})

    }catch(e){
        res.status(400).send({result:"unabe to change password"})
    }
    


})
//----------------------------------------------------- reset password -------------------------------------------------------------------------
router.post('/getresetcode',async(req,res)=>{
    const email = req.body.emailValue
    const user =await User.findOne({email})
   

    try{
        if(user){

            const otpgen = ()=>{
                let otp = Math.floor(Math.random()*1000000)
               
                if(otp.toString().length != 6){
                    otpgen()
                }
                return otp
            }
            const otp = otpgen()
    
    
            const storeOtp = async()=>{
                const otpObj = {
                    expiresAt: new Date(Date.now() + 60 * 10 * 1000),
                    email:email ,
                    otp:otp
                }
                const otpModel = new ResetOtp(otpObj)
                await otpModel.save()
                //---------------------------------------- send otp to mail---------------------------------------
                sendResetOtp(otp,email)
    
    
    
            }
            
            storeOtp()
            res.send({result:"opt send successfully"})
    
        }else {
            res.send({result:"email not found"})
        }

    }catch(error){
        console.log(error,'error')
    }

})
router.post('/resetpassword',async(req,res)=>{
    const {emailValue,newPass,otpValue} = req.body
    const otpFind = await ResetOtp.findOne({'email':emailValue})


    if(otpFind.otp == otpValue){
     
        const user = await User.findOne({'email':emailValue})
        
        user.password = newPass
        await user.save()
  



        
        res.status(201).send({result:"password change successfully"})
    }else {
        res.send({result:"otp is not correctt"})

    }
    

})
router.get('/emailcheck/:email',async(req,res)=>{
    const email = req.params.email 
   
    const response = await User.find(({'email':email})).select({email:1,status:1})
    res.send({email:response})
    

})

module.exports = router
