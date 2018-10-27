const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();

mongoose.connect('mongodb://localhost:27017/db', {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen('8080', () => {
    console.log('Server started at port 3000');
});