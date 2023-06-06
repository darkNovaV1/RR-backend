const cloudinary = require('cloudinary').v2;

// config cloudinary
cloudinary.config({
  cloud_name: "dhtlm3rhc",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret:process.env.CLOUDINARY_SECRET
});

module.exports=cloudinary;