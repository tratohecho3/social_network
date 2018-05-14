'use script'
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_red_social_lol';   
exports.createToken = function(user){
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix()
    }

    return jwt.encode(payload,secret)
}   