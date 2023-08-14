require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendOtp = (otp,email)=>{

  console.log(email,'email')
  const msg = {
    to: email, // Change to your recipient
    from: 'dipjoy488@gmail.com', // Change to your verified sender
    subject: 'Verification Code ',
    text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    html: `<strong>Your opt is :${otp}</strong>`,
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
    // res.send('sent successfully')
  })
  .catch((error) => {
    console.error(error)
  })



}


// ---------------------------------------------------------------------------------------
const sendResetOtp = (otp,email)=>{

  
  const msg = {
    to: email, // Change to your recipient
    from: 'dipjoy488@gmail.com', // Change to your verified sender
    subject: 'password reset code for DigiStore  ',
    text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    html: `<strong>Your opt is :${otp}</strong>`,
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  
  })
  .catch((error) => {
    console.error(error)
  })



}
module.exports ={sendOtp,sendResetOtp}
