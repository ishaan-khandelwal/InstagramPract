require("dotenv").config()
const express = require("express");
const app = express()
const connectDB = require("./connection")
const authRoutes = require("./routes/auth.routes")
const authenticateToken = require("../middleware/auth")
const PORT = process.env.PORT || 65535
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_REELS_QUERY = process.env.YOUTUBE_REELS_QUERY || "youtube shorts"
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
app.get('/api/reels', async (req, res) => {
    if (!YOUTUBE_API_KEY) {
        return res.status(500).json({
            message: "Missing YOUTUBE_API_KEY on the server."
        })
    }

    const maxResults = Math.min(Number(req.query.maxResults) || 6, 10)
    const query = (req.query.q || YOUTUBE_REELS_QUERY).toString().trim()
    const params = new URLSearchParams({
        key: YOUTUBE_API_KEY,
        part: "snippet",
        type: "video",
        q: query,
        maxResults: String(maxResults),
        order: "viewCount",
        videoDuration: "short",
        videoEmbeddable: "true",
        regionCode: "IN",
        safeSearch: "moderate"
    })

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`)
        const payload = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({
                message: payload?.error?.message || "Failed to fetch YouTube reels."
            })
        }

        const items = (payload.items || []).map((item) => ({
            id: item.id?.videoId,
            title: item.snippet?.title,
            channelTitle: item.snippet?.channelTitle,
            description: item.snippet?.description,
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
            publishedAt: item.snippet?.publishedAt
        })).filter((item) => item.id)

        res.status(200).json({ items })
    } catch (error) {
        res.status(500).json({
            message: "Unable to reach YouTube right now."
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})
