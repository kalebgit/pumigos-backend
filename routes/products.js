//own function
const {getDataFromFile, getLimitedData, getInstanceById, createInstance, updateInstance, deleteInstances} = require("../util/manager")
const {Router} = require("express");

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
    res.send(getLimitedData(req.query.limit, products));
})

productsRouter.get("/:id", (req, res, next)=>{
    getInstanceById(products, req.params.id)
        .then((productFound)=>{
            res.send(productFound);
        })
        .catch((err)=>{
            res.send(err)
        })
})

productsRouter.post("/", (req, res, next)=>{
    const {title, description, code, price, status, stock, category, thumbnails} = req.body;
    createInstance(
        {
            path: FILEPATH,
            collection: products,
            body: req.body,
            id:  (products.length > 0 ? products[users.length - 1].id : 0) + 1,
            objectValid: title && description && code && price && status && stock && category && thumbnails, 
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
    updateInstance({
        collection: products, 
        path: FILEPATH,
        id: id,
        updatedData: req.body,
        notDuplicated: false
    })
})

productsRouter.delete("/:id", (req, res, next)=>{
    deleteInstances({
        collection: products,
        path: FILEPATH,
        id: req.params.id,
        deleteAll: false
    })
})

productsRouter.delete("/", (req, res, next)=>{
    deleteInstances({
        collection: products,
        path: FILEPATH,
        id: false,
        deleteAll: req.query.deleteAll
    })
})

module.exports = productsRouter;