'use strict'

let path = require('path');
let fs = require('fs');
let mongoosePaginate = require('mongoose-pagination');
let User = require('../models/user');
let Follow = require('../models/follow');

function prueba(req, res) {
    res.status(200).send({message: 'Hola mundo desde el controlador de follows'});
}

function saveFollow( req, res) {
    let params = req.body;
    let follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        if( !followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

        return res.status(200).send({follow: followStored});
    })

}

function deleteFollow(req, res) {
    let userId = req.user.sub;
    let followId =  req.params.id;

    Follow.find({'user':userId, 'followed': followId}).remove( err => {
        if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

        return res.status(200).send({message: 'El follow se ha eliminado'});
    })
}

function getFollowingUsers(req, res) {
    let userId = req.user.sub;
    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    let page = 1;
    if(req.params.page) {
        page = req.params.page;
    }
    else {
        page = req.params.id; 
    }

    let itemsPerPage = 4;

    Follow.find({user: userId}).populate({path:'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

        return res.status(200).send({total, pages: Math.ceil(total/itemsPerPage), follows});
    })
}

function getFollowedUsers(req, res) {
    let userId = req.user.sub;
    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    let page = 1;
    if(req.params.page) {
        page = req.params.page;
    }
    else {
        page = req.params.id; 
    }

    let itemsPerPage = 4;

    Follow.find({followed: userId}).populate('user followed').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

        return res.status(200).send({total, pages: Math.ceil(total/itemsPerPage), follows});
    })
}

function getMyFollows(req, res) {
    let userId = req.user.sub;
    let find = Follow.find({user: userId});

    if (req.params.followed) {
        find = Follow.find({followed: userId})
    }
    find.populate('user followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No sigues a  ningun usuario'});

        return res.status(200).send({follows});
    })
}


module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}