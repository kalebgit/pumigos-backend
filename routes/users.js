const {Router} = require("express")
const fs = require("fs")
const path = require("path")

//own method
const {writeInstanceFile, getDataFromFile, getLimitedData, getInstanceById, createInstance, updateInstance} = require("../util/manager")

//using router
const usersRouter = Router();

//FOR FUTURE AUTH WITH SESSIONS
// usersRouter.use((req, res, next)=>{

// })

const FILEPATH = './data/users.json';

let users;




//function to update the array of users that will be returned by the server
usersRouter.use((req, res, next)=>{
    getDataFromFile(FILEPATH)
        .then((data)=>{
            users = data;
            next()
        })
        .catch((err)=>{
            res.send(500)
        })
})


//function for get method of all users or a limit of users
usersRouter.get('/', (req, res, next)=>{
    const {limit} = req.query;  
    res.send(getLimitedData(limit, users))
})

//function to get a user for a specific id
usersRouter.get("/:id", (req, res, next)=>{
    const {id} = req.params;
    getInstanceById(users, id)
        .then((userFound)=>{
            res.send(userFound);
        })
        .catch((err)=>{
            console.log(err)
        })
})

usersRouter.post('/', (req, res, next)=>{
    const {email, password} = req.body;
    createInstance(
        {
            path: FILEPATH, 
            collection: users, 
            body: req.body,
            id: (users.length > 0 ? users[users.length - 1].id : 0) + 1,
            objectValid: email && password && email.includes('@'),
            notDuplicated: !users.find((user)=>user.email == email)
        }
    )
    .then(()=>{
        req.session.account = {email};
        console.log("the session id now is: " + req.sessionID);
        console.log("the account in the session is: " + req.session.account)
        res.send(200)
    })
    .catch((err)=>{
        res.send(err)
    })
})

usersRouter.put('/:id', (req, res, next)=>{
    const {id} = req.params;
    updateInstance({
        collection: users,
        id: id,
        path: FILEPATH,
        updatedData: req.body,
        notDuplicated: !users.find((user)=>(user.email == userToBeUpdated.email && user.id != id))
    })
    .then(()=>{
        res.send(200)
    })
    .catch((err)=>{
        res.send(err)
    })
})

usersRouter.delete('/:id', (req, res, next)=>{
    const {id} = req.params
    if(users.find((user)=>user.id == id)){
        users = users.map((user)=>!(user.id == id));
        writeInstanceFile(FILEPATH, users)
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
        users = [];
        writeInstanceFile(FILEPATH, users)
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