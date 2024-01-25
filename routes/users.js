const {Router} = require("express")
const fs = require("fs")
const path = require("path")
const usersRouter = Router();

//FOR FUTURE AUTH WITH SESSIONS
// usersRouter.use((req, res, next)=>{

// })

const FILEPATH = path.join(path.dirname, 'data/users.json');

let usersArray;

async function writeUsersFile(){
    return new Promise((resolve, reject)=>{
        fs.promises.writeFile(FILEPATH, JSON.stringify(usersArray), {encoding: 'utf-8'})
            .then((value)=>{
                resolve()
            })
            .catch((err)=>{
                reject()
            })
    })
}

usersRouter.use((req, res, next)=>{
    fs.promises.readFile(FILEPATH, {encoding: 'utf-8'})
        .then((data)=>{
            const returnedUsers = JSON.parse(data);
            if(returnedUsers){
                usersArray = returnedUsers;
            }else{
                usersArray = [];
            }
            next()
        })
        .catch((err)=>{
            console.log("error with the users file: " + err);
            res.send(500)
        })
})

usersRouter.get('/', (res, req, next)=>{
    const {limit} = res.query;

    if(!limit){
        let limitedUsers = usersArray.slice(1, (limit + 1));
        console.log("the request has a limit: " + limit)
        res.send(limitedUsers);
    }else{
        console.log("the request has no limit")
        res.send(usersArray);
    }
})

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
    const {username, password} = req.body;
    const newId = usersArray[-1].id + 1;
    if(username && password){
        usersArray.push({id: newId, username: username, password: password});
        writeUsersFile()
            .then(()=>{
                console.log("the user has been created, answer: " + value);
                res.send(201)
            })
            .catch(()=>{
                console.log("an error has ocurred: " + err)
                res.send(500)
            })
    }
})

usersRouter.put('/', (req, res, next)=>{
    const userToBeUpdated = req.body;
    if(userToBeUpdated && userToBeUpdated.id){
        const userFound = usersArray.find((user)=>user.id == userToBeUpdated.id)
        if(userFound){
            usersArray = usersArray.map((user)=>{
                if(user.id == userToBeUpdated.id){
                    return userToBeUpdated;
                }else{
                    return user;
                }
            });    
            writeUsersFile()
                .then(()=>{
                    console.log("the user has been updated");
                    res.send(200)
                })
                .catch(()=>{
                    console.log("error in the file")
                    res.send(500)
                })
        }else{
            console.log("user not found to update the info")
            res.send(404)
        }
    }else{
        console.log("there's no data in the request")
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
            .catch(()=>{
                console.log("error in the file")
                res.send(500);
            })
        
    }else{
        console.log("user not found to be deleted")
        res.send(404)
    }
    
})



export default usersRouter;