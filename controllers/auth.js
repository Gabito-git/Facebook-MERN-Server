const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');
const { googleValidator } = require('../helpers/googleValidator');

const newUser = async( req, res ) => {

    const { email, password } = req.body;
   

    try {

        let user = await User.findOne({ email });

        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo electrónico ya existe'
            })
        }

        user = new User( req.body );

        const salt    = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();
        const token = await generarJWT( user._id, user.name )

        res.status(201).json({
            ok: true,
            user,
            token
        })
        
    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
    }
  
}

const validarToken = async( req, res ) => {

    const { uid, name } = req;
    // console.log( uid, name )

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token,
        user: {
            uid, name
        }       
    })

}

const loginUser = async( req, res ) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        const token = await generarJWT( user._id, user.name );

        res.status(200).json({
            ok: true,
            user,            
            token
        })
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor, contacte con su administrador'
        })
    }

}

const googleSignIn = async( req, res ) => {

    const { id_token } = req.body;

    try {
        const { email, name, image } = await googleValidator( id_token );

        let user = await User.findOne({ email });

        if( !user ){

            const data= {
                name,
                email,
                image,
                password:'is google auth',
                google: true
            }

            user = new User( data );
            user.save();
        }        

        const token = await generarJWT( user._id, user.name );
    
        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token de Google no reconocido'
        })
    }

}

module.exports = {
    newUser,
    loginUser,
    validarToken,
    googleSignIn
}