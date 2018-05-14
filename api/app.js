'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Loading routes


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors


//routes
app.get('/', (req,res) => res.send({message: 'hello'}));

module.exports = app;