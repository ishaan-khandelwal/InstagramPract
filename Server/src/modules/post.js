const Post = require('../Schemas/post')

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 })
        res.status(200).json({ status: 'success', data: posts })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params
        const userId = req.userId

        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        const isLiked = post.likes.includes(userId)

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
        } else {
            // Like
            post.likes.push(userId)
        }

        await post.save()
        res.status(200).json({ 
            status: 'success', 
            liked: !isLiked, 
            likeCount: post.likes.length 
        })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

const createPost = async (req, res) => {
    try {
        const { imageUrl, caption } = req.body
        const post = await Post.create({
            author: req.userId,
            imageUrl,
            caption
        })
        res.status(201).json({ status: 'success', data: post })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

module.exports = { getPosts, toggleLike, createPost }
