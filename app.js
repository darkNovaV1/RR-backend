const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const reservations = [];

// --------------> set up MiddleWares <---------------------

// making a static folder to server js and css files
app.use(express.static('public'));

// to parse the encode form data
app.use(bodyParser.urlencoded({extended:true}));


// ----------------> set up route <--------------------
app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/public/home.html');
});

app.get('/booking',(req,res)=>{
    res.sendFile(__dirname+'/public/seat_booking.html');
})

app.post('/booking',(req,res)=>{
    reservations.push({
        "date": req.body.date,
        "time": req.body.time,
        "partySize": req.body.partySize,
        });
    res.redirect('/menu');
})

app.get('/menu',(req,res)=>{
    res.sendFile(__dirname+'/public/food_menu.html');
})

app.get('/payment',(req,res)=>{
    res.sendFile(__dirname+'/public/payment.html')
})

app.post('/payment',(req,res)=>{
    res.send(req.body);
})

// listen for incoming connections on port 30000
app.listen(3000, ()=>{
    console.log('server running on port 3000');
});