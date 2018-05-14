'use strict'
const mongoose = require('mongoose');
let schema = mongoose.Schema;
let userSchema = schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);
