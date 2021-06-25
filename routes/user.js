// const { check } = require('express-validator');
const { Router } = require('express');

// const {validarToken } = require('../controllers/auth');
const { getUserImage } = require('../controllers/user');
const validarJWT = require('../middlewares/validarJWT');
// const validarCampos = require('../middlewares/validarCampos');

const router = Router();

router.use( validarJWT );

router.get( '/', getUserImage );


module.exports = router;

