'use strict'

const express = require('express');
let userController = require('../controllers/user');
let router = express.Router();
let mdAuth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: './uploads/users'});

router.get('/home',userController.home);
router.get('/pruebas',mdAuth.ensureAuth,userController.pruebas);
router.post('/register',userController.saveUser);
router.post('/login',userController.loginUser);
router.get('/user/:id',mdAuth.ensureAuth,userController.getUser);
router.get('/users/:page?',mdAuth.ensureAuth,userController.getUsers);
router.get('/counters/:id?', mdAuth.ensureAuth, userController.getCounters);
router.put('/update-user/:id', mdAuth.ensureAuth,userController.updateUser);
router.post('/upload-image-user/:id', [mdAuth.ensureAuth, md_upload],userController.uploadImage);
router.get('/get-image-user/:imageFile',userController.getImageFile);



module.exports = router;
