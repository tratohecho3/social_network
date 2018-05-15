'use strict'
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_red_social_lol';   

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'})
    }
    let token = req.headers.authorization.replace(/['"]+/g,'');
    try {

        var payload = jwt.decode(token,secret);

        if(payload.exp <= moment().unix()){

            return res.status(401).send({message: 'El token ha expirado'})
        }

    
    } catch (error) {

        return res.status(404).send({message: 'El token no es valido'})

    }
    req.user = payload;
    next();

}