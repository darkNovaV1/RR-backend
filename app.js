const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require('ejs');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const bcryptjs  = require('bcryptjs');
const multer = require('multer');


const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/RestaurantDB';
const User = require('./models/User');
const Menu = require('./models/Menu');
const Order = require('./models/Order');





// --------------> set up MiddleWares <---------------------

// making a static folder to server js and css files
app.use(express.static('public'));

// to parse the encode form data and json data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

 // Authentication middleware
 const requireAuth = (req, res, next) => {
    req.session.redirectTo = req.originalUrl;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

// password hashing function
const securePassword = async(password)=>{
    try {
        
       const passwordHash = bcryptjs.hash(password,10); // 10 salt
        return passwordHash 
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// saving file received by users

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'public/menuImages'),function(error,success){
            if(error)throw error
        })
    },
    filename:function(req,file,cb){
        let date= new Date();

        const name =date.toISOString().slice(0,10)+'-'+file.originalname;
         cb(null,name,function(error,success){
            if(error)throw error
         })
        
    }
});

 
const upload = multer({storage:storage})





async function main() {

    // establishing connection with monogdb 
    await mongoose.connect(uri).then(console.log('connected to DB '));

    // ----------------> set up route <--------------------
    app.get('/', (req, res) => {
        
        res.sendFile(__dirname + '/public/home.html');
    });

    app.route('/booking').get((req, res) => {
    
        res.sendFile(__dirname + '/public/seat_booking.html');
    })
        .post((req, res) => {
            req.session.booking = {
                "date": req.body.date,
                "time": req.body.time,
                "partySize": req.body.partySize,
                "specialRequest": req.body.specialRequest
            };
            res.redirect('/menu');
        })

    app.route('/menu')
        .get(async (req, res) => {
            const foods = await Menu.find();
            res.render('Menu', { foodItems: foods });
        })

    app.route('/login')
        .get((req, res) => {
            
            if (req.session.user) {
                const redirect = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                res.redirect(redirect);
            }
            else {
                res.sendFile(__dirname + '/public/login.html');
            }
        })
        .post(async (req, res) => {
            try {
                
                const user1 = await User.findOne({ email: req.body.email });
            
                if (user1) {
                    const matched = bcryptjs.compareSync(req.body.password,user1.password);
                    console.log(matched);
                    if (matched) {

                        req.session.user = user1;
                        const redirectTo = req.session.redirectTo || '/';
                        delete req.session.redirectTo;
                        res.redirect(redirectTo);
                    }
                    else {
                        res.send('wrong password');
                    }
                }
                else {
                    res.send('User do not exits');
                }
            } catch (e) {
                res.send(e.message);
            }
        })

    app.route('/signUp').get((req ,res)=>{
           res.sendFile(__dirname+'/public/signup.html')

    })
    .post(async (req, res) => {

        const spassword = await securePassword(req.body.password)
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: spassword,

        });
        try {
            const oldUser = await User.findOne({$or:[{username:req.body.username},{email:req.body.email}]});
    

            if(!oldUser){
            const docs = await user.save();
            req.session.user = user;
            const redirect = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirect);}
            else{
                res.send('this username or email already exits try something else');
            }
        }
        catch (e) {
            console.error(e.message);
            res.send(e);
        }
    

    })


    app.post('/bill',async(req,res)=>{
            req.session.bill = req.body.selectFoods;
            res.json({ message: 'Bill received and processed successfully' });
    })




    app.route('/payment')
        .get( requireAuth ,(req, res) => {
            res.sendFile(__dirname + '/public/payment.html')
        })
        .post(async (req, res) => {
            let order = new Order({
                user: req.session.user.username,
                date: req.session.booking.date,
                time: req.session.booking.time,
                partySize: req.session.booking.partySize,
                specialRequest: req.session.booking.specialRequest,
                bill:req.session.bill,
            });

            try {
                order = await order.save();
            }
            catch (e) {
                console.log(e);
            }
            res.send(order);
        })


    app.route('/menuUpdate')
        .get(async (req, res) => {
            const foods = await Menu.find();
            res.render('menuUpdate', { menuItems: foods })
            //res.sendFile(__dirname+'/public/menuUpdate.html')
        })
        .post( upload.single('image') ,async (req, res) => {
            const menu = new Menu({
                name: req.body.name,
                cost: parseInt(req.body.cost),
                rating: req.body.rating,
                image: req.file.filename,
            });

            try {
                await menu.save();
                res.redirect('/menuUpdate');
            } catch (error) {
                console.error(error);
            }

        })

    app.post('/menuDelete/:item', async (req, res) => {
        try {
            const item = await Menu.findOne({ _id: req.params.item });
            // Delete a image file
            fs.unlink(__dirname+'/public/menuImages/'+item.image, (err) => {
                if (err) {
                    console.error(err);
                return;
                }

                console.log('File deleted successfully');
             });
             // Delete item from db
            await Menu.findOneAndDelete({_id:req.params.item});
            res.redirect('/menuUpdate');
        }
        catch (e) {
            console.error(e);
        }
    })


    app.route('/order').get(async (req, res) => {
        const orderlist = await Order.find();
        res.render('orders', { orders: orderlist });
    })

    app.get('/logOut', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    })

    app.get('/test', (req,res)=>{
        
        
        res.send(today )
        
    })


    // listen for incoming connections on port 30000
    app.listen(3000, () => {
        console.log('server running on port 3000');
    });
};

main();