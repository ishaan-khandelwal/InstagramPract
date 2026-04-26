const mongoose = require("mongoose")

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        }
    },
    { timestamps: true }
)

messageSchema.index({ sender: 1, recipient: 1, createdAt: 1 })

module.exports = mongoose.model("Message", messageSchema)
