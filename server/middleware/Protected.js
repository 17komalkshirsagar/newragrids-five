const jwt = require("jsonwebtoken");

exports.adminProtected = (req, res, next) => {
    const { authToken } = req.cookies
    if (!authToken) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(authToken, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
