require("dotenv").config()
const express = require("express");
const http = require("http")
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const app = express()
const { connectDB, isDbConnected } = require("./connection")
const authRoutes = require("./routes/auth.routes")
const authenticateToken = require("../middleware/auth")
const Auth = require("./Schemas/auth")
const Message = require("./Schemas/message")
const { JWT_SECRET } = require("./config")
const PORT = process.env.PORT || 65535
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_REELS_QUERY = process.env.YOUTUBE_REELS_QUERY || "youtube shorts"
const FALLBACK_REELS = [
    { id: "aqz-KE-bpKQ", title: "Big Buck Bunny Short Clip", channelTitle: "Blender Foundation" },
    { id: "L_jWHffIx5E", title: "Music Video Snippet", channelTitle: "Smash Mouth" },
    { id: "ysz5S6PUM-U", title: "YouTube API Demo Clip", channelTitle: "YouTube" },
    { id: "dQw4w9WgXcQ", title: "Classic Viral Clip", channelTitle: "Rick Astley" },
    { id: "M7lc1UVf-VE", title: "YouTube Player API Demo", channelTitle: "YouTube Developers" },
    { id: "5qap5aO4i9A", title: "LoFi Background Reel", channelTitle: "Lofi Girl" },
    { id: "kJQP7kiw5Fk", title: "Top Trending Music Clip", channelTitle: "Luis Fonsi" },
    { id: "3JZ_D3ELwOQ", title: "Pop Reel Sample", channelTitle: "Mark Ronson" },
    { id: "RgKAFK5djSk", title: "Short Music Reel", channelTitle: "Wiz Khalifa" },
    { id: "2Vv-BfVoq4g", title: "Acoustic Reel Mood", channelTitle: "Ed Sheeran" },
    { id: "fRh_vgS2dFE", title: "Live Performance Reel", channelTitle: "Justin Bieber" },
    { id: "09R8_2nJtjg", title: "Indie Vibe Reel", channelTitle: "Maroon 5" }
]
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

function getConversationRoom(userA, userB) {
    return [String(userA), String(userB)].sort().join(":")
}

function getFallbackReelsPage(maxResults, rawPageToken) {
    const startIndex = Math.max(Number.parseInt(rawPageToken || "0", 10) || 0, 0)
    const items = FALLBACK_REELS.slice(startIndex, startIndex + maxResults).map((item) => ({
        ...item,
        description: "",
        thumbnail: "",
        publishedAt: null
    }))
    const nextIndex = startIndex + items.length
    const nextPageToken = nextIndex < FALLBACK_REELS.length ? String(nextIndex) : null

    return { items, nextPageToken }
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
        status: "ok",
        database: isDbConnected() ? "connected" : "disconnected"
    })
})
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Token is valid",
        userId: req.userId
    })
})
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
    try {
        const otherUserId = req.params.userId
        const otherUser = await Auth.findById(otherUserId).select("_id")

        if (!otherUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const messages = await Message.find({
            $or: [
                { sender: req.userId, recipient: otherUserId },
                { sender: otherUserId, recipient: req.userId }
            ]
        })
            .sort({ createdAt: 1 })
            .limit(100)

        res.status(200).json({
            status: "success",
            data: messages
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
})
app.get('/api/reels', async (req, res) => {
    const maxResults = Math.min(Number(req.query.maxResults) || 6, 10)
    const query = (req.query.q || YOUTUBE_REELS_QUERY).toString().trim()
    const pageToken = typeof req.query.pageToken === "string" ? req.query.pageToken.trim() : ""

    if (!YOUTUBE_API_KEY) {
        const fallback = getFallbackReelsPage(maxResults, pageToken)
        return res.status(200).json({
            ...fallback,
            source: "fallback"
        })
    }
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

    if (pageToken) {
        params.set("pageToken", pageToken)
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`)
        const payload = await response.json()

        if (!response.ok) {
            const fallback = getFallbackReelsPage(maxResults, pageToken)
            return res.status(200).json({
                ...fallback,
                source: "fallback",
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

        res.status(200).json({
            items,
            nextPageToken: payload.nextPageToken || null
        })
    } catch (error) {
        const fallback = getFallbackReelsPage(maxResults, pageToken)
        res.status(200).json({
            ...fallback,
            source: "fallback",
            message: "Unable to reach YouTube right now."
        })
    }
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                return callback(null, true)
            }

            return callback(new Error("Not allowed by CORS"))
        },
        methods: ["GET", "POST"]
    }
})

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token

        if (!token) {
            return next(new Error("Unauthorized"))
        }

        const decodedToken = jwt.verify(token, JWT_SECRET)
        const user = await Auth.findById(decodedToken._id).select("_id username email")

        if (!user) {
            return next(new Error("Unauthorized"))
        }

        socket.user = user
        next()
    } catch {
        next(new Error("Unauthorized"))
    }
})

io.on("connection", (socket) => {
    const userId = String(socket.user._id)
    socket.join(userId)

    socket.on("chat:join", ({ recipientId } = {}) => {
        if (!recipientId) {
            return
        }

        socket.join(getConversationRoom(userId, recipientId))
    })

    socket.on("chat:send", async ({ recipientId, body } = {}, callback) => {
        try {
            const trimmedBody = body?.trim()

            if (!recipientId || !trimmedBody) {
                return callback?.({ ok: false, message: "Message is required." })
            }

            const recipient = await Auth.findById(recipientId).select("_id")

            if (!recipient) {
                return callback?.({ ok: false, message: "Recipient not found." })
            }

            const message = await Message.create({
                sender: userId,
                recipient: recipientId,
                body: trimmedBody
            })
            const payload = message.toObject()
            const room = getConversationRoom(userId, recipientId)

            io.to(room).emit("chat:message", payload)
            io.to(String(recipientId)).emit("chat:message", payload)
            callback?.({ ok: true })
        } catch {
            callback?.({ ok: false, message: "Unable to send message." })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})
