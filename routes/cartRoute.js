const router = require("express").Router();

const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const Cart = require('../model/Cart');

//CREATE
router.post("/create", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    }
    catch (err) {
        res.status(500).json(err)
    }

})

//UPDATE
router.put("/update", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Cart = await Cart.findOne({ userId: req.query.userId });
        if (Cart._id === req.query.id) {
            const updatedCart = await Cart.findByIdAndUpdate(
                req.query.id,
                {
                    $set: req.body
                },
                {
                    new: true
                }
            )
            res.status(200).json(updatedCart);
        }
        else {
            res.status(500).json({ "err": "u r not allowed to do that" })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//DELETE
router.get('/delete', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.query.id);
        res.status(200).json("Cart has been deleted..");
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET BY ID // it will take user id
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const Cart = await Cart.findOne({ userId: req.query.userId });
        res.status(200).json(Cart);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//Cart Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const page = req.query.page || 0;
    const qNew = req.query.new === "true";
    try {


        let Carts;

        if (qNew) {
            Carts = await Cart.find().sort({ createdAt: -1 }).skip(page * 20).limit(20);
        }
        else {
            Carts = await Cart.find().skip(page * 20).limit(20);
        }


        res.status(200).json(Carts);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;