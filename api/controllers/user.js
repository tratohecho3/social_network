'use strict'

let User = require('../models/user');
let bcrypt = require('bcrypt-nodejs');
let mongoosePaginate = require('mongoose-pagination')
let jwt = require('../services/jwt');
let fs = require('fs');
let path = require('path');

function home(req,res){
    res.status(200).send({
        message: ' Hola mundo desde el servidor '
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
        
        //Controlar usuarios duplicados
        User.find({$or:[
            {email:user.email.toLowerCase()},
            {nick:user.nick.toLowerCase()}
        ]}).exec((err,users) => {
            if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});
            if (users && users.length > 0){
                return res.status(200).send({message: 'Usuario que intenta registrar ya existe'})
            }
            else{
                    //Cifrado y guardado de datos
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
            });
    
    }
    else{
        res.status(200).send({
            message: 'Envia todos los datos'
        })
    }
}

function loginUser(req,res){
    let params = req.body;
    let email = params.email;
    let password = params.password;

    User.findOne({email:email},(err,user) => {
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(user){
            bcrypt.compare(password,user.password,(err,check) => {
                if(check){
                    if(params.getToken){
                        //Devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }
                    else {
                        user.password = undefined;
                        return res.status(200).send({user})
                    }

                }

                else{
                    return res.status(404).send({message:'El usuario no se ha podido loguear'})
                }
            })
        }
        else{
            return res.status(404).send({message:'El usuario no se ha encontrado'})
        }
        
    })
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!user) return res.status(404).send({message: 'El usuario no existe'})
        return res.status(200).send({user})
    })
} 

function getUsers(req, res) {
    let identity_user_id = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    let itemsPerPage = 5;

    User.find().sort('_id').paginate(page,itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

        return res.status(200).send({users,total,pages: Math.ceil(total/itemsPerPage)})
    })
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'})
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'})

        return res.status(200).send({user: userUpdated});
    })

}

function uploadImage(req, res) {

    let userId = req.params.id;

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];
        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1]

        if (userId != req.user.sub) { 
            return removeFilesOfUploads(res,file_path, 'No tienes permiso para actualizar los datos del usuario');
            
        }
    
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
                if (err) return res.status(500).send({message: 'Error en la peticion'});

                if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'})

                return res.status(200).send({user: userUpdated});
            })
        }

        else{
            return removeFilesOfUploads(res,file_path, 'Extension no valida');
        }
    }

    else{
        return res.status(200).send({message: 'No se han subido imagenes'})
    }

}

function removeFilesOfUploads(res,file_path, message) {
    fs.unlink(file_path, (err) => {
        if(err) return res.status(200).send({message})
    });
}

function getImageFile(req, res) {
    let image_file = req.params.imageFile;
    let path_file = './uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        }
        else {
            res.status(200).send({message: 'No existe la imagen...'})
        }
    });

}
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}