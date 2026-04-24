const express = require("express")
const router = express.Router()
const { login, signup } = require("../modules/auth")

router.post('/login', login)
router.post('/signup', signup)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('username email')
        res.status(200).json({
            status: "success",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})
module.exports = router