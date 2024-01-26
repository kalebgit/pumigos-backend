const {Router} = require("express")

//creating router
const productsRouter = Router()

const FILEPATH = './data/products.json'

productsRouter.use((req, res, next)=>{
    next()
});

productsRouter.get("/",(req, res, next)=>{
    const {limit} = req.query;
})

productsRouter.get("/:id", (req, res, next)=>{
    const {id} = req.params;
})

productsRouter.post("/", (req, res, next)=>{
    const newProduct = req.body;
})

productsRouter.put("/:id", (req, res, next)=>{
    const {id} = req.params;
})

productsRouter.delete("/:id", (req, res, next)=>{
    
})


module.exports = productsRouter;