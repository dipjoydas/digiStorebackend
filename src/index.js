const express = require('express')
require('./db/mongoose')

const app = express()
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const tempoOrdersRouter = require('./routers/tempoOrders')
// const test = require('./models/testing')
const port =process.env.PORT || 5000
app.use(taskRouter)
app.use(userRouter)
app.use(tempoOrdersRouter)
// app.use(test)
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.send('ji')
// })
app.listen(port,()=>{
    `listening on port ${port}`
})