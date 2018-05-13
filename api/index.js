'use strict'
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/localhost')
    .then(() => console.log('connected'))
    .catch((err) => console.log(err))