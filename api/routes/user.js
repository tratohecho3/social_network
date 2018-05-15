'use strict'

const express = require('express');
let userController = require('../controllers/user');
let router = express.Router();
let mdAuth = require('../middlewares/authenticated');

router.get('/home',userController.home);
router.get('/pruebas',mdAuth.ensureAuth,userController.pruebas);
router.post('/register',userController.saveUser);
router.post('/login',userController.loginUser);

module.exports = router;
