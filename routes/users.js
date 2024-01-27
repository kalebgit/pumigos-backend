const {Router} = require("express")
const fs = require("fs")
const path = require("path")
const usersRouter = Router();
//own method
const {getDataFromFile, getLimitedData, getInstanceById, createInstance, updateInstance, deleteInstances} = require("../util/manager")
//variables
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
    res.send(getLimitedData(req.query.limit, users))
})

//function to get a user for a specific id
usersRouter.get("/:id", (req, res, next)=>{
    getInstanceById(users, req.params.id)
        .then((userFound)=>{
            res.send(userFound);
        })
        .catch((err)=>{
            res.send(err)
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
    deleteInstances({
        collection: users,
        path: FILEPATH,
        id: req.params.id,
        deleteAll: false
    })
})

usersRouter.delete('/', (req, res, next)=>{
    deleteInstances({
        collection: users,
        path: FILEPATH,
        id: NaN,
        deleteAll: req.query.deleteAll
    })
})

module.exports = usersRouter;