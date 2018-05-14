'use strict'

const express = require('express');
let userController = require('../controllers/user');
let router = express.Router();

router.get('/home',userController.home);
router.get('/pruebas',userController.pruebas);
router.post('/register',userController.saveUser);
router.post('/login',userController.loginUser);

module.exports = router;
