const Post = require("./Post");


class Sockets { 

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {

            console.log('cliente conectado')

            socket.on('post-update', async() => {

                const posts = await Post.find()
                                        .populate('user', ['image', 'name'])
                                        .sort({"createdAt": "desc"});

                // callback( posts );

                this.io.emit('post-update', posts);
                
            });
                    
        
        });
    }


}


module.exports = Sockets;