'use strict'
const mongoose = require('mongoose');
let schema = mongoose.Schema;
let messageSchema = schema({
    emmiter: {type: schema.ObjectId, ref: 'User'},
    receiver:{type: schema.ObjectId, ref: 'User'},
    text: String,
    created_at: String 
});

module.exports = mongoose.model('Message', messageSchema);
