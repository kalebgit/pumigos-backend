//own function
const {writeInstanceFile, getDataFromFile, getLimitedData, createInstance} = require("../util/manager")

const {Router} = require("express");

//creating router
const productsRouter = Router();

const FILEPATH = './data/products.json'
//array of products
let products;

productsRouter.use((req, res, next)=>{
    getDataFromFile(FILEPATH)
        .then((data)=>{
            products = data;
            next();
        })
        .catch((err)=>{
            res.sendStatus(500)
        })
});

productsRouter.get("/",(req, res, next)=>{
    const {limit} = req.query;
    res.send(getLimitedData(limit, products));
})

productsRouter.get("/:id", (req, res, next)=>{
    const {id} = req.params;
    getInstanceById(products, id)
        .then((productFound)=>{
            res.send(productFound);
        })
        .catch((err)=>{
            console.log(err)
        })
})

productsRouter.post("/", (req, res, next)=>{
    const newProduct = req.body;
    createInstance(
        {
            path: FILEPATH,
            collection: products,
            body: req.body,
            id:  (products.length > 0 ? products[users.length - 1].id : 0) + 1,
            objectValid: true, 
            notDuplicated: true
        }
    )
    .then(()=>{
        res.send(200);
    })
    .catch((err)=>{
        res.send(err);
    })

})

productsRouter.put("/:id", (req, res, next)=>{
    const {id} = req.params;
})

productsRouter.delete("/:id", (req, res, next)=>{
    
})


module.exports = productsRouter;