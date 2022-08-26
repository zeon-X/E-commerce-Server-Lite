const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

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
    const userInfo = req.body.user;

    let user = await User.findOne({ username: userInfo.username }); //db return
    // console.log(user)

    if (!user) {
      const newUser = new User({
        username: userInfo.username,
        email: userInfo.username,
      });

      // console.log(newUser);
      // console.log("newUser\n\n");

      try {
        user = await newUser.save(); // db return
      } catch (err) {
        res.status(500).json(err);
      }
    }

    // console.log(user);
    //gen token then rest work
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    // console.log(accessToken);

    res.status(200).json(accessToken);
  } catch (err) {
    res.status(500).json({ errorMsgcustomized: err });
  }
});

module.exports = router;
