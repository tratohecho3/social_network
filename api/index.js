'use strict'
const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/localhost')
    .then(() => {
        console.log('connected');
        app.listen(port,() => console.log('Server running at' + port));
    })
    .catch((err) => console.log(err))