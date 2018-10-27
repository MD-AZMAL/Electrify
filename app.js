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
app.use(express.static('public'));

//genesis block setup
let genesisblock = new block('00000000000', '00000000000', 0, 0);
genesisblock.prevhash = '0'.repeat(64);
genesisblock.index = 0;
let Blockchain = new blockchain(genesisblock);
Blockchain.blocks[0] = Blockchain.mine(Blockchain.blocks[0])
console.log(Blockchain);
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
    res.render('frontpage');
});

app.get('/sigup', (req, res) => {

});

app.get('/login', (req, res) => {
    console.log('login')
});

app.get('/home', (req, res) => {
    // console.log(res.locals.currentUser);
    Receiver.find({}, (err, receiverList) => {
        if (!err) {
            res.render('infopage', { receiverList: receiverList });
        } else {
            console.log(err);
        }
    })

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

app.post('/send', isLoggedIn, (req, res) => {
    let cost = 6.45 * req.body.requirement;
    User.findOne({ userId: res.locals.currentUser.userId }, (serr, sender) => {
        if (!serr) {
            User.findOne({ userId: req.body.receiverId }, (rerr, receiver) => {
                if (!rerr) {
                    console.log(receiver)
                    if (receiver.cash - cost > 0 && sender.points - req.body.requirement > 0) {
                        Receiver.findOne({ receiverId: req.body.receiverId }, (err, rec) => {
                            if (!err) {
                                let tmp = new block(res.locals.currentUser.userId, req.body.receiverId, Number(req.body.requirement), cost);
                                tempChain.push(tmp);
                                Receiver.findByIdAndRemove(rec._id, (rmerr) => {
                                    if (!rmerr) {
                                        console.log('removed');
                                        res.send('sent');
                                    } else {
                                        console.log(rmerr);
                                    }
                                });
                            } else {
                                console.log(rmerr);
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
            res.send('received on server');
        } else {
            console.log('Error : ' + err);
        }
    });
});

app.get('/mine', isLoggedIn, (req, res) => {
    console.log('in mine');
    console.log(tempChain);
    let minedBlock = Blockchain.mine(tempChain[0]);
    minedBlock.prevhash = Blockchain.getprevblock().hash;
    minedBlock.index = Blockchain.blocks.length;
    Blockchain.blocks.push(minedBlock);
    tempChain.shift();
    console.log(Blockchain.blocks)

    User.findOne({ userId: minedBlock.data.senderkey }, (serr, sender) => {
        if (!serr) {
            sender.cash = sender.cash + minedBlock.data.money - 1;
            sender.points = sender.points - minedBlock.data.power;
            sender.save((saveserr) => {
                if (!saveserr) {
                    User.findOne({ userId: minedBlock.data.receiverkey }, (rerr, receiver) => {
                        if (!rerr) {
                            receiver.cash = receiver.cash - minedBlock.data.money;
                            receiver.points = receiver.points + minedBlock.data.power;
                            receiver.save((savererr) => {
                                if (!savererr) {
                                    User.findOne({ userId: res.locals.currentUser.userId }, (merr, miner) => {
                                        if (!merr) {
                                            miner.cash += 1;
                                            miner.save((savemerr) => {
                                                if (!savemerr) {
                                                    res.send('mining completed');
                                                } else {
                                                    console.log(savemerr);
                                                }
                                            });
                                        } else {
                                            console.log(merr);
                                        }
                                    });
                                } else {
                                    console.log(savererr);
                                }
                            });
                        } else {
                            console.log(rerr);
                        }
                    });
                } else {
                    console.log(saveserr);
                }
            });
        } else {
            console.log(serr);
        }
    });
});

app.listen('8080', () => {
    console.log('Server started at port 8080');
});