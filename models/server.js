const express = require('express');
const dbConnection = require('../db/config');
const http  = require('http');

const fileUpload = require('express-fileupload');
const socketio = require('socket.io');

const Sockets  = require('./sockets');


const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Http server
        this.server = http.createServer( this.app );
    
        // Configuraciones de sockets
        this.io = socketio( this.server, {
            cors:{
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        } );

        this.sockets = new Sockets( this.io );

        this.conectarDB();

        this.middlewares();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());

        this.app.use(express.json());

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true              // Crea la carpeta destino si no existe
        }));

        //Routes
        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/user', require('../routes/user'));
        this.app.use('/api/uploads', require('../routes/uploads'));
        this.app.use('/api/post', require('../routes/post'));
    }

    execute() {
        // HTTP server
        this.server.listen(this.port, () => {
            console.log(`Server corriendo en puerto: ${this.port}`);
        });
    }
}

module.exports = Server;
