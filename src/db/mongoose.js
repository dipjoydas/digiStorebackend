const mongoose = require('mongoose')
require("dotenv").config()
process.env.MONGODBURI
mongoose.connect(process.env.MONGODBURI,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
  createIndexes: true
})




const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// // Define the schema
// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: { type: Date, expires: 0 },
// });

// // Create the model
// const Post = mongoose.model('Post', postSchema);

// // Connect to the database
// // db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////



// const newPost = new Post({
//     title: 'My Blog Post',
//     content: 'Lorem ipsum dolor sit amet.',
//     expiresAt: new Date(Date.now() + 60 * 1000), // Expiration time set to 24 hours from now
//   });

//   newPost.save()
//   .then(() => {
//     console.log('Post saved successfully.');
//   })
//   .catch((error) => {
//     console.error('Error saving post:', error);
//   });






// // //////////////////////////////////////////////////////////////////////////////////////////////////////
// // db.once('open', () => {
// //   console.log('Connected to MongoDB');

// //   // Create a new post
// //   const newPost = new Post({
// //     title: 'My Blog Post',
// //     content: 'Lorem ipsum dolor sit amet.',
// //     expiresAt: new Date(Date.now() + 60 * 1000), // Expiration time set to 24 hours from now
// //   });

// //   // Save the post
// //   newPost.save()
// //     .then(() => {
// //       console.log('Post saved successfully.');
// //     })
// //     .catch((error) => {
// //       console.error('Error saving post:', error);
// //     });

// //   // Close the database connection after 5 seconds
// // //   setTimeout(() => {
// // //     db.close(() => {
// // //       console.log('Database connection closed.');
// // //     });
// // //   }, 5000);
// // });

