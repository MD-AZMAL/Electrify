const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession = require('express-session'),
    isLoggedIn = require('./middlewares/isLoggedIn'),
    User = require('./models/user'),
    Receiver = require('./models/receive'),
    block = require('./block'),
    blockchain = require('./blockchain'),
    app = express();

mongoose.connect('mongodb://localhost:27017/electrify', {
    useNewUrlParser: true
});
// server requirements  


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



//genesis block setup
let genesisblock = new block('0', '00000000000', '0,', '0', '0', '0');
let Blockchain = new blockchain(genesisblock);
let genBlock = Blockchain.mine(genesisblock);
Blockchain.blocks.push(genBlock);
console.log(Blockchain.blocks[0].data);
var tempChain = [];

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
    var NewUser = new User({ username: req.body.username, email: req.body.email, userId: req.body.userId, points: 100, cash: 500 });
    User.register(NewUser, req.body.password, function (err, user) {
        if (err) {
            console.log('Error : ' + err);
            return res.render('signup');
        }

        passport.authenticate('local')(req, res, function () {
            console.log(user);
            res.redirect('/home');
        });
    });
});

app.post('/send', (req, res) => {
    let cost = 10;
    User.findOne({ userId: req.body.senderId }, (serr, sender) => {
        if (!serr) {
            User.findOne({ userId: req.body.receiverId }, (rerr, receiver) => {
                if (!rerr) {
                    if (receiver.cash - cost > 0 && sender.points - req.body.requirement > 0) {
                        Receiver.findOne({ receiverId: req.body.receiverId }, (err, rec) => {
                            if (!err) {
                                let cost = 10;
                                let tmp = new block(req.body.senderId, req.body.receiverId, req.body.requirement, cost);
                                tempChain.push(tmp);
                                console.log(tmp);
                            } else {
                                console.log(err);
                            }
                        });
                    } else {
                        console.log('Transaction not possible');
                        res.redirect('home');
                    }
                } else {
                    console.log(rerr);
                }
            });
        } else {
            console.log(serr);
        }
    });
});

app.post('/receive', (req, res) => {
    let rec = {
        receivername: req.body.receivername,
        receiverId: req.body.receiverId,
        requirement: req.body.requirement
    }
    Receiver.create(rec, (err, receiver) => {
        if (!err) {
            console.log(receiver);
        } else {
            console.log('Error : ' + err);
        }
    });
});

app.listen('8080', () => {
    console.log('Server started at port 8080');
});
console.log(Blockchain.blocks[0]);