require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path')


const db = require('./lib/db');
const routes = require('./routes/index');

const app = express();
app.use(cors()); // Enable CORS for all routes

app.use(express.static(path.join(__dirname, 'build')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api/', routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Server started on port ' + process.env.PORT);
});