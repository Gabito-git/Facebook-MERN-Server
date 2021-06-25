const User = require("../models/User");


const getUserImage = async( req, res ) => {

    const uid = req.uid;

    try {

        const user = await User.findById( uid );

        res.json({
            ok: true,
            profileImage: user.image
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con su administrador'
        })
    }    

}

module.exports = {
    getUserImage,
}