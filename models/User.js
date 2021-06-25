
const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({

    name:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ''
    },

    google:{
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

UsuarioSchema.methods.toJSON = function(){
    const {
         __v,
          _id, 
          password, 
          email, 
          createdAt, 
          updatedAt, 
          ...user } = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = model( 'User', UsuarioSchema );