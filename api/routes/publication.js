'use strict'
const express = require('express');
let PublicationController = require('../controllers/publication');
let router = express.Router();
let mdAuth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: './uploads/publications'});

router.get('/probando-pub', mdAuth.ensureAuth, PublicationController.probando);
router.post('/publication', mdAuth.ensureAuth, PublicationController.savePublication);
router.get('/publications/:page?', mdAuth.ensureAuth, PublicationController.getPublications);
router.get('/publication/:id', mdAuth.ensureAuth, PublicationController.getPublication);
router.delete('/publication/:id', mdAuth.ensureAuth, PublicationController.deletePublication);
router.post('/upload-image-pub/:id', [mdAuth.ensureAuth, md_upload], PublicationController.uploadImage);
router.get('/get-image-pub/:imageFile', PublicationController.getImageFile);




module.exports = router;