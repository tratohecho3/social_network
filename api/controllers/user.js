'use strict'

let user = require('../models/user');

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

module.exports = {
    home,
    pruebas
}