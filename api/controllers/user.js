'use strict'

let User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

function home(req,res){
    res.status(200).send({
        message: ' Hola mundo desdeel servidor '
    })
}

function pruebas(req,res){
    console.log(req.body)
    res.status(200).send({
        message: 'Accion de pruebas'
    })
}

function saveUser(req,res){
    let params = req.body;
    let user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        console.log('hol1   a');
        
        bcrypt.hash(params.password,null,null,(err,hash) => {
            user.password = hash;
            user.save((err,userStored) => {
                if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                if(userStored){
                    res.status(200).send({user: userStored});
                }
                else {
                    res.status(404).send({message: 'No se ha registrado el usuario'});
                }
            });

        })
    }
    else{
        res.status(200).send({
            message: 'Envia todos los datos'
        })
    }
}


module.exports = {
    home,
    pruebas,
    saveUser
}