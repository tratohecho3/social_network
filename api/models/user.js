'use strict'
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);
