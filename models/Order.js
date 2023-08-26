const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },  
    password:{
        type:String,
        required:true,
    },     
});

const orderSchema = mongoose.Schema({
    date:String,
    time:String,
    partySize:Number,
    user:String,
    specialRequest:String,
    bill:JSON,
    total:String,
    orderedAt:String,

});

const orderModel = mongoose.model('Order',orderSchema);

module.exports=orderModel