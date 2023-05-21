const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require('ejs');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const mongoose = require('mongoose');
const uri ='mongodb://127.0.0.1:27017/RestaurantDB';
const User= require('./models/User');
const Menu = require('./models/Menu');
const Order = require('./models/Order');
 



// --------------> set up MiddleWares <---------------------

// making a static folder to server js and css files
app.use(express.static('public'));

// to parse the encode form data
app.use(bodyParser.urlencoded({extended:true}));

// set template engine
app.set('view engine', 'ejs');


// specify database location/collection to store session in mongodb
const store = new MongoDBSession({
    uri: uri,
    collection: 'Session',
})

// set up session
app.use(session({
    secret: 'key that will sign cookie',
    resave: false, // create new session for every request even if its same user
    saveUninitialized: false, // if we haven't modified the session we don't want save
    store: store // store specify database to store session
}));


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
    req.session.booking={
        "date": req.body.date,
        "time": req.body.time,
        "partySize": req.body.partySize,
        "specialRequest":req.body.specialRequest
        };
    res.redirect('/menu');
})

app.route('/menu')
.get(async(req,res)=>{
    const foods = await Menu.find();
    res.render('Menu',{foodItems:foods});
})

app.route('/login')
.get((req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }
    else{
    res.sendFile(__dirname+'/public/login.html');
    }
})
.post(async(req,res)=>{
    try{
   const user1= await User.findOne({email:req.body.email});
   if(user1){
        if(user1.password==req.body.password){
            
            req.session.user=user1;
            res.redirect('/payment');
        }
        else{
            res.send('wrong password');
        }
   }
   else{
    res.send('User do not exits');
   }
    }catch(e){
        res.send(e.message);
    }
})

app.route('/signUp').post(async(req,res)=>{
    const user= new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
       
    });
    try{
        const docs = await user.save();
        req.session.user=user;
        res.redirect('/');
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
.post(async(req,res)=>{
    let order = new Order({
        date:req.session.booking.date,
        time:req.session.booking.time,
        partySize:req.session.booking.partySize,
        specialRequest:req.session.booking.specialRequest,
        user:req.session.user.username,
    });

    try{
      order = await order.save();
    }
    catch(e){
        console.log(e);
    }
    res.send(order);
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


app.route('/order').get(async(req,res)=>{
    const orderlist= await Order.find();
    res.render('orders',{orders:orderlist});
})

app.get('/logOut',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})



// listen for incoming connections on port 30000
app.listen(3000, ()=>{
    console.log('server running on port 3000');
});
};

main();