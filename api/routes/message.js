'use strict'
const express = require('express');
let MessageController = require('../controllers/message');
let router = express.Router();
let mdAuth = require('../middlewares/authenticated');

router.get('/probando-md', mdAuth.ensureAuth, MessageController.probando);
router.post('/message', mdAuth.ensureAuth, MessageController.saveMessage);
router.get('/my-messages/:page?', mdAuth.ensureAuth, MessageController.getReceivedMessages);
router.get('/messages/:page?', mdAuth.ensureAuth, MessageController.getEmmitMessages);
router.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages);
router.get('/set-viewed-messages', mdAuth.ensureAuth, MessageController.setViewedMessages);



module.exports = router;