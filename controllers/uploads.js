const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Post = require('../models/Post');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImages = async(req, res) => {

	const { file } = req.files;

	const extensionesValidas = ['png', 'jpeg', 'jpg', 'gif']   
	const nombreDividido = file.name.split('.');
	const extension = nombreDividido[ nombreDividido.length - 1 ];

	if(!extensionesValidas.includes( extension ) ){
		return res.status(400).json({
			ok: false,
			msg: `La extensión ${ extension } no es válida. ${ extensionesValidas }`
		});      
	}

    const { coleccion, id } = req.params;
    
    let modelo;

	try {
		switch ( coleccion ) {
			case 'users':
			  modelo = await User.findById( id );
			  if( !modelo ){
				  return res.status(400).json({
					  ok: false,
					  msg: `No existe un usuario con el id ${ id }`
				  })
			  }
			  break;
	  
		  case 'posts':
			  modelo = await Post.findById( id );
			  if( !modelo ){
				  return res.status(400).json({
					  msg: `No existe un producto con el id ${ id }`
				  })
			  }
			  break;		
		  
			default:
			  return res.status(500).json({
				ok: false,
				msg: 'Opción no habilitada'
			  });
		  }          

		 // Eliminar imágenes previas. Verifica que el enlace en BD sea de una imagen en cloudinary y no 
		 // de Gmail. Si es de cloudinary, elimina la anterior
		  if ( modelo.image ){
			 const nombreArr = modelo.image.split('/');

			 if( nombreArr.includes( 'res.cloudinary.com' ) ){
				const nombre    = nombreArr[ nombreArr.length -1 ];
				const [ public_id ] = nombre.split('.')
				cloudinary.uploader.destroy( `${ coleccion }/${ public_id }`);
			 }		
		  }

		  const { tempFilePath } = file;          
		  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {
			  public_id: `${ coleccion }/${ uuidv4() }`,
			  timeout: 120000
		  });		  
	  
		  modelo.image = secure_url;
		  await modelo.save();
	
		  res.json( {
			  ok: true,
			  image: modelo.image
		  } );
		
	} catch (msg) {
		res.status(400).json({ msg });
	}    
}

const deleteImagePost = async(req, res) => {

	const id = req.id;
	post = await Post.findById( id );

	if ( post.image ){
		const nombreArr = post.image.split('/');

		if( nombreArr.includes( 'res.cloudinary.com' ) ){
		   const nombre    = nombreArr[ nombreArr.length -1 ];
		   const [ public_id ] = nombre.split('.')
		   cloudinary.uploader.destroy( `posts/${ public_id }`);
		}		
	 }

	 post.image ="";

	 await post.save();

	 res.json( {
		 ok: true
	 } )


}


module.exports = {
    uploadImages,
	deleteImagePost
}