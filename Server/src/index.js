const express = require("express");
const app = express()
const connectDB = require("./connection")
const authRoutes = require("./routes/auth.routes")
const dotenv = require("dotenv")
const { authenticateToken } = require("../middleware/auth")

dotenv.config()

connectDB()

app.use(express.json())
app.use('/api', authenticateToken, authRoutes)

app.listen(65535, () => {
    console.log(`Server running on port http://localhost:65535`);

})
