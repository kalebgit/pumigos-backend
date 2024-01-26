const {Router} = require("express")
const fs = require("fs")
const path = require("path")

//using router
const usersRouter = Router();

//FOR FUTURE AUTH WITH SESSIONS
// usersRouter.use((req, res, next)=>{

// })

const FILEPATH = './data/users.json';

let usersArray;

//function to write the whole array in the file
async function writeUsersFile(){
    return new Promise((resolve, reject)=>{
        fs.promises.writeFile(FILEPATH, JSON.stringify(usersArray), {encoding: 'utf-8'})
            .then((value)=>{
                resolve(value)
            })
            .catch((err)=>{
                reject(err)
            })
    })
}

//function to update the array of users that will be returned by the server
usersRouter.use((req, res, next)=>{
    fs.promises.readFile(FILEPATH, {encoding: 'utf-8'})
        .then((data)=>{
            if(data){
                usersArray = JSON.parse(data);
            }else{
                usersArray = [];
            }
            next()
        })
        .catch((err)=>{
            console.log("error with the users file at the first middleware of route users: " + err);
            res.send(500)
        })
})


//function for get method of all users or a limit of users
usersRouter.get('/', (req, res, next)=>{
    const {limit} = req.query;

    if(limit){
        let limitedUsers = usersArray.slice(0, (limit + 1));
        console.log("the request has a limit: " + limit)
        res.send(limitedUsers);
    }else{
        console.log("the request has no limit")
        res.send(usersArray);
    }
})

//function to get a user for a specific id
usersRouter.get("/:id", (req, res, next)=>{
    const {id} = req.params;
    const userFound = usersArray.find((user)=>user.id == id);
    if(userFound){
        console.log("user returned...")
        res.send(userFound);
    }
    else{
        console.log("user not found with the id: " + id);
        res.send(404);
    }
})

usersRouter.post('/', (req, res, next)=>{
    const {email, password} = req.body;
    const newId = (usersArray.length > 0 ? usersArray[usersArray.length - 1].id : 0) + 1;
    //verify the email
    const isEmail = email.includes('@');
    if(email && password && isEmail){
        if(!usersArray.find((user)=>user.email == email)){
            usersArray.push({id: newId, email: email, password: password});
            writeUsersFile()
            .then((value)=>{
                console.log("the user has been created, answer: " + value);
                res.send(201)
            })
            .catch((err)=>{
                console.log("an error has ocurred: " + err)
                res.send(500)
            })
        }else{
            console.log("this email has been used, try another")
            res.send(409)
        }
    }else{
        console.log("there's not enough data to create a user " + (isEmail ? ", also the email doesn't have @" : ""))
        res.send(409)
    }
})

usersRouter.put('/:id', (req, res, next)=>{
    const {id} = req.params;
    const userToBeUpdated = req.body;
    if(userToBeUpdated){
        //CHEKCS the email
        if(!usersArray.find((user)=>(user.email == userToBeUpdated.email && user.id != id))){
            const userFound = usersArray.find((user)=>user.id == id)
            if(userFound){
                usersArray = usersArray.map((user)=>{
                    if(user.id == id){
                        return {id: user.id, ...userToBeUpdated};
                    }else{
                        return user;
                    }
                });    
                writeUsersFile()
                    .then(()=>{
                        console.log("the user has been updated");
                        res.send(200)
                    })
                    .catch((err)=>{
                        console.log("error in the file")
                        res.send(500)
                    })
            }else{
                console.log("user not found to update the info")
                res.send(404)
            }
        }else{
            console.log("that email has been used")
            res.send(409)
        }
        
    }else{
        console.log("there's not enough data in the request to update the user")
        res.send(409)
    }
})

usersRouter.delete('/:id', (req, res, next)=>{
    const {id} = req.params
    if(usersArray.find((user)=>user.id == id)){
        usersArray = usersArray.map((user)=>!(user.id == id));
        writeUsersFile()
            .then(()=>{
                console.log("the element has been deleted")
                res.send(200);
            })
            .catch((err)=>{
                console.log("error in the file")
                res.send(500);
            })
        
    }else{
        console.log("user not found to be deleted")
        res.send(404)
    }
})

usersRouter.delete('/', (req, res, next)=>{
    const {deleteAll} = req.query;
    if(deleteAll){
        usersArray = [];
        writeUsersFile()
        .then(()=>{
            console.log("all elements had been deleted")
            res.send(200);
        })
        .catch((err)=>{
            console.log("error in operation")
            res.send(500);
        })
    }else{
        res.send(418)
    }
})

module.exports = usersRouter;