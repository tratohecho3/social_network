'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Loading routes
let user_routes = require('./routes/user');
let follow_routes = require('./routes/follow');
let publication_routes = require('./routes/publication');
//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors


//routes
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);


module.exports = app;