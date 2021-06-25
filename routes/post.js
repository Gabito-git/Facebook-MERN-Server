const { check } = require('express-validator');
const { Router } = require('express');

const { newPost, getPosts, deletePost, editPost } = require('../controllers/post');
const validarJWT = require('../middlewares/validarJWT');
const validarCampos = require('../middlewares/validarCampos');
const validarUsuario = require('../middlewares/validarUsuario');


const router = Router();
router.use( validarJWT );

router.post('/', [
    check('body', 'El cuerpo del post es obligatorio').not().isEmpty(),
    validarCampos
], newPost);

router.get('/',  getPosts);

router.delete('/:id',[
    validarUsuario,
    check('id').isMongoId(),
    validarCampos
] ,deletePost)

router.put('/:id',[
    validarUsuario,
    check('id').isMongoId(),
    check('body', 'El cuerpo del post es obligatorio').not().isEmpty(),
    validarCampos
], editPost);


module.exports = router;