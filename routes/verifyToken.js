const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;


    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // console.log(token);
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json("token not valid");
            }
            else {
                req.user = user;
                // console.log(user);
                next();
            }
        });
    }
    else {
        return res.status(401).json("u r not authenticated");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        // console.log(req.query)
        if (req.user.id === req.query.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("u r not allowed");
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("u r not allowed to do that");
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};