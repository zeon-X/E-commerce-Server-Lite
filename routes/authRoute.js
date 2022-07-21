const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
    });


    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const userInfo = req.body.user;

        let user = await User.findOne({ username: userInfo.username }); //db return
        // console.log(user)

        if (!user) {
            const newUser = new User({
                username: userInfo.email,
                email: userInfo.email
            });

            try {
                user = await newUser.save(); // db return
            }
            catch (err) {
                res.status(500).json(err);
            }
        }

        //gen token then rest work
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // console.log(accessToken);

        res.status(200).json(accessToken);

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;