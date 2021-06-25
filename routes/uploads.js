const { check } = require('express-validator');
const { Router } = require('express');

const validarJWT = require('../middlewares/validarJWT');
const validarCampos = require('../middlewares/validarCampos');
const { uploadImages, deleteImagePost } = require('../controllers/uploads');
const validarArchivo = require('../middlewares/validarArchivo');
const validarUsuario = require('../middlewares/validarUsuario');

const router = Router();

router.put('/:coleccion/:id',[ 
    validarArchivo,
    validarJWT,
    check('id').isMongoId(),
    validarCampos
], uploadImages);

router.delete('/:id',[
    validarJWT,
    validarUsuario,
    check('id').isMongoId(),
    validarCampos
], deleteImagePost)


module.exports = router;