'use strict'
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let messageSchema = Schema({
    emitter: {type: Schema.ObjectId, ref: 'User'},
    receiver:{type: Schema.ObjectId, ref: 'User'},
    text: String,
    viewed: String,
    created_at: String 
});

module.exports = mongoose.model('Message', messageSchema);
