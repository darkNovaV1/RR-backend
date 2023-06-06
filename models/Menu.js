const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
    },
    cost:Number,
    rating:Number,
    image:String,
    thumbnail:String,
    imageID:String,
})

const menuModel = mongoose.model("Menu",menuSchema);
module.exports = menuModel;
