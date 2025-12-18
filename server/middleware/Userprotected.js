const jwt = require("jsonwebtoken");

exports.userProtected = (req, res, next) => {
    const { userToken } = req.cookies
    if (!userToken) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(userToken, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
