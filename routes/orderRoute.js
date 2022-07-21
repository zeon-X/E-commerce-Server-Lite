const router = require("express").Router();
const mongoose = require('mongoose');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const Order = require('../model/Order');

//CREATE
router.post("/create", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    }
    catch (err) {
        res.status(500).json(err)
    }

})

//UPDATE
router.put("/update", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.query.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//DELETE
router.get('/delete', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.query.id);
        res.status(200).json("Order has been deleted..");
    } catch (err) {
        res.status(500).json(err);
    }
})



//GET BY ID // it will take user id
router.get('/find', verifyTokenAndAuthorization, async (req, res) => {

    // const userId = mongoose.Schema.Types.ObjectId(req.user.id);
    // console.log(userId)


    try {
        const Orders = await Order.find({ userId: req.user.id }).populate('products.productId');
        res.status(200).json(Orders);
    }
    catch (err) {
        res.status(500).json({ "error": err })
    }


    // Order.find({ userId: userId }).exec((err, data) => {
    //     if (data) {
    //         res.status(200).json(data);
    //     } else {
    //         res.status(500).json(err);
    //     }
    // })


})



//Order All
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const page = req.query.page || 0;
    const qNew = req.query.new === "true";
    try {


        let Orders;

        if (qNew) {
            Orders = await Order.find().sort({ createdAt: -1 }).skip(page * 20).limit(20);
        }
        else {
            Orders = await Order.find().skip(page * 20).limit(20);
        }


        res.status(200).json(Orders);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//Order STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                }
            }
        ])

        res.status(200).json(income);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;