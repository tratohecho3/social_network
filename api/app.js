'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Loading routes
let user_routes = require('./routes/user');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors


//routes
app.use('/api',user_routes);


module.exports = app;