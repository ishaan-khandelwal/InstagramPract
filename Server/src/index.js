const express = require("express");
const app = express()
const connectDB = require("./connection")
const authRoutes = require("./routes/auth.routes")
const authenticateToken = require("../middleware/auth")
const PORT = process.env.PORT || 65535
const frontendUrls = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)

function isAllowedOrigin(origin) {
    if (!origin) {
        return true
    }

    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return true
    }

    if (origin.endsWith(".vercel.app")) {
        return true
    }

    return frontendUrls.includes(origin)
}

connectDB()

app.use((req, res, next) => {
    const requestOrigin = req.headers.origin

    if (isAllowedOrigin(requestOrigin)) {
        res.header("Access-Control-Allow-Origin", requestOrigin || "*")
        res.header("Vary", "Origin")
    }

    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if (req.method === "OPTIONS") {
        return res.sendStatus(204)
    }

    next()
})
app.use(express.json())
app.use('/api', authRoutes)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Token is valid",
        userId: req.userId
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})
