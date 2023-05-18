const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const uri ='mongodb://127.0.0.1:27017/RestaurantDB';
const User = require('./models/User');
// const session = require('express-session');

const reservations = [];

// --------------> set up MiddleWares <---------------------

// making a static folder to server js and css files
app.use(express.static('public'));

// to parse the encode form data
app.use(bodyParser.urlencoded({extended:true}));

async function main(){
    // establishing connection with monogdb 
    await mongoose.connect(uri).then(console.log('connected to DB '));

// ----------------> set up route <--------------------
app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/public/home.html');
});

app.route('/booking').get((req,res)=>{
    res.sendFile(__dirname+'/public/seat_booking.html');
})
.post((req,res)=>{
    reservations.push({
        "date": req.body.date,
        "time": req.body.time,
        "partySize": req.body.partySize,
        });
    res.redirect('/menu');
})

app.route('/menu')
.get((req,res)=>{
    res.sendFile(__dirname+'/public/food_menu.html');
})

app.route('/login')
.get((req,res)=>{
    res.sendFile(__dirname+'/public/login.html');
})
.post((req,res)=>{
    console.log(req.body);
    res.send('ok');
})

app.route('/signUp').post(async(req,res)=>{
    const user= new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    });
    try{
        const docs = user.save();
        res.send('ok');
    }
    catch(e){
        console.error(e.message);
        res.send(e);
    }
    
})

app.route('/payment')
.get((req,res)=>{
    res.sendFile(__dirname+'/public/payment.html')
})
.post((req,res)=>{
    res.send(req.body);
})





// listen for incoming connections on port 30000
app.listen(3000, ()=>{
    console.log('server running on port 3000');
});
};

main();