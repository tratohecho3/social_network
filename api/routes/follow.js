'use strict'

const express = require('express');
let followController = require('../controllers/follow');
let router = express.Router();
let mdAuth = require('../middlewares/authenticated');

router.post('/follow',mdAuth.ensureAuth, followController.saveFollow);
router.delete('/follow/:id', mdAuth.ensureAuth, followController.deleteFollow);
router.get('/following/:id?/:page?', mdAuth.ensureAuth, followController.getFollowingUsers);
router.get('/followed/:id?/:page?', mdAuth.ensureAuth, followController.getFollowedUsers);
router.get('/get-my-follows/:followed?', mdAuth.ensureAuth, followController.getMyFollows);

module.exports = router;