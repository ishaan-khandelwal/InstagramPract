const Auth = require("../Schemas/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "efibweugebfcibhefeblbjfbheri7gfrienficfgxefuihegh"

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            })
        }

        const user = await Auth.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" })

        return res.status(200).json({
            message: "Login successful",
            token
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function signup(req, res) {
    try {
        const username = req.body.username?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password?.trim()

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            })
        }
        const user = await Auth.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashPass = await bcrypt.hash(password, 10)
        const newuser = new Auth({
            username,
            email,
            password: hashPass
        })
        await newuser.save()

        const token = jwt.sign({ _id: newuser._id }, JWT_SECRET, { expiresIn: "1h" })
        return res.status(201).json({
            message: "User created successfully",
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = { login, signup }
