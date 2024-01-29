const UsersRoute = require('./routes/users')
const ProductsRoute = require('./routes/products')
const CartsRoute = require('./routes/carts')

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
//using default server
const {createServer} = require('http')
const {Server} = require("socket.io")


const app = express();
//creating a server
const server = createServer(app);//you can add a parameter that will be executed in every request
const io = new Server(server, {
    cors: {origin: '*', methods: ["GET", "POST"]}
})

io.on('connection', (socket)=>{
    console.log("user conectado")
    socket.emit('bienvenido', 'Hola cliente, bienvenido', {nombre: "Emiliano"})
    socket.on('clientMessage', (...args)=>{
        console.log(...args)
    })

    socket.on('messageSent', (data)=>{
        console.log("a message has been sent, data: ")
        console.log(data)
    })

    socket.on("saludo", (data)=>{
        console.log(data)
    })
})

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const sessionSettings = {
        secret: "milou is awesome",
        resave: false,
        saveUninitialized: false,
        cookie: {

        }
}
app.use(session(sessionSettings));
app.use((req, res, next)=>{
    console.log("method requested: " + req.method);
    next();
});

app.use("/api/users", UsersRoute)
app.use("/api/products", ProductsRoute)
app.use("api/carts", CartsRoute)

const PORT = 8080



server.listen(PORT, ()=>{
    console.log("The server is listening in port: " + PORT)
})



