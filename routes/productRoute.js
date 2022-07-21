const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const Product = require('../model/Product');

//CREATE
router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (err) {
        res.status(500).json(err)
    }

})

//UPDATE
router.put("/update", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.query.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//DELETE
router.get('/delete', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.query.id);
        res.status(200).json("product has been deleted..");
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET BY ID // GET ONE
router.get('/find', async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//GET ALL Products
router.get("/allProducts", async (req, res) => {
    const page = req.query.page || 0;
    const qNew = req.query.new === "true";
    const qCategory = req.query.category;
    const qSearch = req.query.search_query;
    try {


        let products;

        if (qNew && qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            }).sort({ createdAt: -1 });

            // .skip(page * 20).limit(20);
        }
        else if (qNew) {
            products = await Product.find().sort({ createdAt: -1 });
            // .skip(page * 20).limit(20);
        }
        else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            })
        }
        else if (qSearch) {
            // console.log("searching for " + qSearch);
            products = await Product.find({
                title: {
                    $regex: qSearch, $options: 'i'
                }
            });

            // .skip(page * 20).limit(20);
        }
        else {
            products = await Product.find();
            // .skip(page * 20).limit(20);
        }


        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;