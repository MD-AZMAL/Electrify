let Blockchain = require("./blockchain");

const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    expressSession = require('express-session'),
    isLoggedIn = require('./middlewares/isLoggedIn'),
    User = require('./models/user'),
    app = express();

mongoose.connect('mongodb://localhost:27017/electrify', {
    useNewUrlParser: true
});

// server requirements

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let blockchain  = new Blockchain();
 
//use total block
   blockchain.blocks;



// passport setup
app.use(expressSession({ secret: 'codaemon secret', saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/sigup', (req, res) => {

});

app.get('/login', (req, res) => {
    console.log('login')
});

app.get('/home', isLoggedIn, (req, res) => {
    console.log(res.locals.currentUser);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// post routes
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}));

app.post('/signup', function (req, res) {
    var NewUser = new User({ username: req.body.username, email: req.body.email, userId: req.body.userId, points: 0, cash: 0 });
    User.register(NewUser, req.body.password, function (err, user) {
        if (err) {
            console.log('Error : ' + err);
            return res.render('signup');
        }

        passport.authenticate('local')(req, res, function () {
            console.log(user);
            // res.redirect('/home');
        });
    });
});

app.listen('8080', () => {
    console.log('Server started at port 8080');
});