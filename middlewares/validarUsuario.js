const Post = require("../models/Post");


const validarUsuario = async( req, res, next ) => {

    const uid = req.uid;
    const { id } = req.params; 

    const post = await Post.findById( id );

    if( !post ){
        return res.status(400).json({
            ok: false,
            msg: `No existe el post con el id ${ id }`
        })
    }

    if( post.user != uid ){
        return res.status(400).json({
            ok: false,
            msg: `No tiene privilegios para realizar esta acción`
        })
    }

    req.id = id;
    req.post = post;
    next();

}

module.exports = validarUsuario