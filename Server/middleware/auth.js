const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../src/config")


function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decodedToken = jwt.verify(token, JWT_SECRET)
        req.userId = decodedToken._id
        next()
    } catch (error) {
        console.error("Token verification failed:", error.message)
        res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = authenticateToken
