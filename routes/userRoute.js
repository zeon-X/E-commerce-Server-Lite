const { verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
const User = require('../model/User');
const { json } = require("express");

router.get("/allUsers/", verifyTokenAndAdmin, async (req, res) => {
    const page = req.query.page || 0;
    const sortNew = req.query.new;
    try {
        const users = sortNew
            ? await User.find().sort({ _id: -1 })
            : await User.find();

        // .skip(page * 20).limit(20);

        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;



/*

try {
        
}
catch (err) {
    res.status(500).json(err)
}

*/