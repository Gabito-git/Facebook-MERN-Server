const { check } = require('express-validator');
const { Router } = require('express');

const { newUser, validarToken, loginUser, googleSignIn } = require('../controllers/auth');
const validarJWT = require('../middlewares/validarJWT');
const validarCampos = require('../middlewares/validarCampos');

const router = Router();

router.get( '/renew', validarJWT, validarToken );

router.post('/register',[
    check('email', 'E-mail inválido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], newUser );

router.post('/',[
    check('email', 'E-mail inválido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginUser);

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;
