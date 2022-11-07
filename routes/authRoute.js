const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    userId: req.body.userId,
    phone: req.body.phone,
  });

  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/verifyToken", verifyToken, (req, res) => {
  req.user.isAdmin
    ? res.status(200).json({ msg: "admin" })
    : res.status(503).json({ msg: "notadmin" });
  // console.log(req.user);
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;
    // console.log(userInfo);

    let user = await User.findOne({ email: userInfo.email }); //db return

    if (!user) {
      try {
        user = await new User({
          email: userInfo.email,
          userId: userInfo.userId,
        }).save(); // db return
      } catch (err) {
        res.status(500).json(err);
        // console.log(err);
      }
    }

    // console.log(user);
    //gen token then rest work
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // console.log(accessToken);

    res.status(200).json(accessToken);
  } catch (err) {
    res.status(500).json({ errorMsgcustomized: err });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const userInfo = req.body;
    // console.log(userInfo);

    let user = await User.findOne({ email: userInfo.email }); //db return

    if (
      userInfo.email !== "mdshefatzeon@gmail.com" ||
      user.userId !== userInfo.userId
    )
      res.status(500).json({ errorMsgcustomized: "u r not admin" });

    // console.log(user);
    //gen token then rest work
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // console.log(accessToken);

    res.status(200).json(accessToken);
  } catch (err) {
    res.status(500).json({ errorMsgcustomized: err });
  }
});

module.exports = router;
