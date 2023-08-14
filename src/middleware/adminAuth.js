const jwt = require('jsonwebtoken')
// const User = require('../models/user')
const Admin = require('../models/admin')
const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authentication').replace('Bearer ','')
        const decoded = jwt.verify(token, 'jtpwbgqupmzbs')
        const admin = await Admin.findOne({_id:decoded._id ,'tokens.token':token})
        if(!admin){
            throw new Error()
        }
        req.token = token 
        req.admin =  admin
        next()

    }catch(error){
        res.status(401).send({erroe:'please authenticate'})

    }
}
module.exports = auth