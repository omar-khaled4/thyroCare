const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversationId: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Index for fast conversation queries
chatMessageSchema.index({ patientId: 1, conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);