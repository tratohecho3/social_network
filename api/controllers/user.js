'use strict'

let User = require('../models/user');
let Follow = require('../models/follow');
let Publication = require('../models/publication');
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
        
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({user,following: value.following, followed: value.followed})
        })
        
    })
} 

async function followThisUser(identity_user_id, user_id){
    try {
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id}).exec()
            .then((following) => {
                console.log(following);
                return following;
            })
            .catch((err)=>{
                return console.log(err);
            });
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id}).exec()
            .then((followed) => {
                console.log(followed);
                return followed;
            })
            .catch((err)=>{
                return console.log(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch(e){
        console.log(e);
    }
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
        
        followUserIds(identity_user_id).then((value) => {
            
            return res.status(200).send({
                users:users,
                users_following:value.following,
                users_follow_me:value.followed,
                total:total,
                pages: Math.ceil(total/itemsPerPage)})
        })
    })
}

async function followUserIds(user_id) {

    try {
        let following = await Follow.find({"user": user_id}).select({'_id':0, '__v':0, 'user':0}).exec().then((follows) => {
            let follows_clean = [];
            console.log(follows)
    
            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            })
            console.log(follows_clean)
            return follows_clean;
        })            
        .catch((err)=>{
            return console.log(err);
        });
    
        let followed = await Follow.find({"followed": user_id}).select({'_id':0, '__v':0, 'followed':0}).exec().then((follows) => {
            let follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.user);
            })
            return follows_clean;
        })
        .catch((err)=>{
            return console.log(err);
        });
        return {following, followed}
    } catch (e) {
        console.log(e);
    }

}

function getCounters(req, res) {
    let userId = req.user.sub;
    if(req.params.id) {
        userId = req.params.id
    }
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value)
    });
  
}

async function getCountFollow(user_id) {

    try {
        let following = await Follow.count({"user": user_id}).exec().then((count, err) => {
            if(err) return console.log(err);
            return count; 
        })

    
    
        let followed = await Follow.count({"followed": user_id}).exec().then((count, err) => {
            if(err) return console.log(err);
            return count; 
        })

        let publications = await Publication.count({"user":user_id}).exec().then((count, err) => {
            if (err) return console.log(err);
            return count;
        })
    
        return { following, followed, publications};
        
    } catch (error) {
        return console.log(error);
    }

}


function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'})
    }

    User.find({$or:[
        {email:update.email},
        {nick:update.nick}
    ]}).exec((err, users) => {
        let user_isset = false
        users.forEach((user) => {
            if(user && user._id != userId) {    
                user_isset = true;
            } 
        })
        if(user_isset) return res.status(404).send({message: 'Los datos ya estan en uso'})
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
            if (err) return res.status(500).send({message: 'Error en la peticion'});
    
            if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'})
    
            return res.status(200).send({user: userUpdated});
        })
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
        return res.status(200).send({message})
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
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}