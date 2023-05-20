const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const ejs = require('ejs');

const mongoose = require('mongoose');
const uri ='mongodb://127.0.0.1:27017/RestaurantDB';
const User = require('./models/User');
const Menu = require('./models/Menu');
// const session = require('express-session');

const reservations = [];

// --------------> set up MiddleWares <---------------------

// making a static folder to server js and css files
app.use(express.static('public'));

// to parse the encode form data
app.use(bodyParser.urlencoded({extended:true}));

// set template engine
app.set('view engine', 'ejs');

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
    res.sendFile(__dirname+'/public/menu.html');
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


app.route('/menuUpdate')
.get(async(req,res)=>{
    const foods = await Menu.find();
    res.render('menuUpdate',{menuItems:foods})
    //res.sendFile(__dirname+'/public/menuUpdate.html')
})
.post(async(req,res)=>{
    const menu = new Menu({
        name:req.body.name,
        cost:parseInt(req.body.cost),
        rating:req.body.rating,
        image:'./assets/burgerr.jpg',
    });

    try {
        await menu.save();
        res.redirect('/menuUpdate');
    } catch (error) {
        console.error(error);
    }
    
})

app.post('/menuDelete/:item',async(req,res)=>{
    try{
    await Menu.findOneAndDelete({_id:req.params.item});
    res.redirect('/menuUpdate');
    }
    catch(e){
        console.error(e);
    }
})




// listen for incoming connections on port 30000
app.listen(3000, ()=>{
    console.log('server running on port 3000');
});
};

main();