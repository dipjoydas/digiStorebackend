const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose

const adminSchema = new Schema({
    email:{
        type:String,
        
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validator(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password can not contain password')

            }
        }
    },
     tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens
    return adminObject
}

adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, 'jtpwbgqupmzbs')
    admin.tokens = admin.tokens.concat({ token: token })
    await admin.save()
    return token
    // return  user

}

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email  })

    if (!admin) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})
const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin