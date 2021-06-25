const Post = require("../models/Post");
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const newPost = async( req, res) => {

    const user = req.uid;
    const { body } = req.body;

    try {

        const post = new Post( { body, user } );    

        await post.save();
    
        res.status(201).json({
            ok:true,
            postId: post.id
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
    }    

}

const getPosts = async( req, res ) => {

    try {

        const posts = await Post.find()
                            .populate('user', ['image', 'name'])
                            .sort({"createdAt": "desc"});

        res.json({
            ok: true,
            posts
        })
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
        
    }    

}

const deletePost = async( req, res ) => {
   
    try {
        const id = req.id;
        const post = req.post;

        //Eliminar la imagen de Cloudinary
        const nombreArr = post.image.split('/');
        const nombre    = nombreArr[ nombreArr.length -1 ];
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy( `posts/${ public_id }`);

        await Post.findByIdAndDelete( id );

        res.json({
            ok: true
        })
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
        
    }

}

const editPost = async(req, res) => {

    try {

        const id = req.id;
        const { body } = req.body;

        const post = await Post.findByIdAndUpdate( id, {body});

        res.json({
            ok:true,
            postId: post._id
        })
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
    }

}

module.exports = {
    newPost,
    getPosts,
    deletePost,
    editPost
}