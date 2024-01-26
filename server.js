const UsersRoute = require('./routes/users')

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");


const app = express();

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

const PORT = 8080

app.listen(PORT, ()=>{
    console.log("The server is listening in port: " + PORT)
})



