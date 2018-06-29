'use strict'
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let publicationSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String,
});

module.exports = mongoose.model('Publication', publicationSchema);
