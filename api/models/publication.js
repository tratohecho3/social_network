'use strict'
const mongoose = require('mongoose');
let schema = mongoose.Schema;
let publicationSchema = schema({
    user: {type: schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String,
});

module.exports = mongoose.model('Publication', publicationSchema);
