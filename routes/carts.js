const {Router} = require("express")
const {getDataFromFile, getLimitedData, getInstanceById, createInstance, updateInstance, deleteInstances} = require("../util/manager")

const cartsRouter = Router();
const FILEPATH = './data/carts.json'
let carts;

cartsRouter.use((req, res, next)=>{
    getDataFromFile(FILEPATH)
        .then((data)=>{
            carts = data;
            next()
        })
        .catch((err)=>{
            res.send(500)
        })
})

cartsRouter.get("/:id", (req, res)=>{
    getInstanceById(carts, req.params.id)
        .then((value)=>{
            res.send(value)
        })
        .catch((err)=>{
            res.send(err)
        })
})

cartsRouter.post("/", (req, res, next)=>{
    const {products} = req.body;
    createInstance({
        path: FILEPATH,
        collection: carts,
        body: req.body,
        id: (carts.length > 0 ? carts[carts.length - 1].id : 0) + 1,
        objectValid: products,
        notDuplicated: true,
    })
    .then(()=>{
        res.send(201)
    })
    .catch((err)=>{
        res.send(err)
    })
})

cartsRouter.post("/:cid/product/:pid", (req, res, next)=>{
    const{cid, pid} = req.params;
    if(cid && pid){
        updateInstance({
            collection: carts,
            id: cid,
            path: FILEPATH,
            updatedData: carts.map((cart)=>{
                if(cart == cid){
                    if(cart.products){
                        cart.products = cart.products.map((product)=>{
                            if(product.id == pid){
                                product.quantity++;
                            }
                            return product
                        })
                    }else{
                        cart.products = [{productsID: pid, quantity: 1}]
                    }
                }
                return cart
            }),
            notDuplicated: true
        })
        .then((value)=>{
            res.send(200)
        })
        .catch((err)=>{
            res.send(err)
        })
    }
    else{
        res.send(409)
    }
})

export default cartsRouter;