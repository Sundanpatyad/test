const express = require("express");
const mongoose = require('mongoose');
const server = express();
const productsRouters = require('./routes/Product');
const categoriesRouters = require('./routes/Category');
const brandsRouter = require('./routes/Brands');
const userRouters = require('./routes/User')
const authRouters = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order')
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { User } = require('./model/User')
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto')
require('dotenv').config();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;






// Configure express middleware
server.use(express.static('build'))
server.use(cors())
server.use(express.json());
server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
server.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  
}));
server.use(passport.initialize());
server.use(passport.session());

// Passport serialization and deserialization


// Passport local strategy
passport.use(new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                return done(null, false, { message: 'No user with this email found' });
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {

                // Here you should use a secure method to compare passwords, like bcrypt
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return done(null, false, { message: "invaid Credentials" });
                } else {
                    return done(null, {id:user.id , role:user.role})
                    
                }
           

            })

        } catch (error) {
            console.error(error);
            return done(error);
        }
    }
));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {id:user.id , role:user.role});
    });
});

passport.deserializeUser(function (user, cb) {

    process.nextTick(function () {
        return cb(null, user);
    });
});

//Payments
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);


server.post('/create-payment-intent', async (req, res) => {
    const { totalAmount, orderId } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // for decimal compensation
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
});
  





// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

main();

// Routes
server.use('/products',productsRouters.router);
server.use('/categories', categoriesRouters.router);
server.use('/brands', brandsRouter.router);
server.use('/users',  userRouters.router);
server.use('/auth', authRouters.router);
server.use('/cart', cartRouter.router);
server.use('/orders', ordersRouter.router);

// Default route
server.get('/', (req, res) => {
    res.json({});
});

function isAuth(req, res, done) {
    if (req.user){
    
        done()
    } else {
        res.sendStatus(401)
    }
}

// Start server
server.listen(process.env.PORT, () => {
    console.log('Server is running');
});
