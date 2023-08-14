const mongoose = require('mongoose')
require("dotenv").config()
process.env.MONGODBURI
mongoose.connect(process.env.MONGODBURI,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true
})




const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

