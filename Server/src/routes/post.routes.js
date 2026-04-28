const express = require('express')
const router = express.Router()
const { getPosts, toggleLike, createPost } = require('../modules/post')
const authenticateToken = require('../../middleware/auth')

router.get('/', getPosts)
router.post('/', authenticateToken, createPost)
router.post('/:postId/like', authenticateToken, toggleLike)

module.exports = router
