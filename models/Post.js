const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    image:{
        type: String,
        default: ''
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

PostSchema.methods.toJSON = function(){
    const {
         __v,
         _id,                  
          ...post} = this.toObject();
    post.id = _id
    return post;
}

module.exports = model( 'Post', PostSchema );