const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decodedToken = jwt.verify(token, 'Ishaan')
        req.userId = decodedToken._id
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = authenticateToken