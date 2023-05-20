const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name:String,
    cost:Number,
    rating:Number,
    image:String,
})

const menuModel = mongoose.model("Menu",menuSchema);
module.exports = menuModel;
