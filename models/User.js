const mongoose = require('mongoose');
// bcrypt for hashing the passorts
//rsconst bcrypt = require('bcrypt');

 

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

// helpful functions

// // this function will executed just before save function i.e model.save()
// userSchema.pre('save',function(next){
//     //  check if user hasn't created password
//     if(!this.isModified('password')){
//         return next()
//     }
//     // if user is creating password for first time then hash it here 10 is salt value
//     this.password =bcrypt.hashSync(this.password,10); 
//     next();
// })

// // compare password 
// // defining custom function inside schema
// userSchema.methods.comparePassword =function(plainText,callback){
//     // check provided password and passwprd sorted in db matched or not
//     return callback(null,bcrypt.compareSync(plainText,this.password));
// }


const userModel = mongoose.model("user",userSchema);
module.exports = userModel