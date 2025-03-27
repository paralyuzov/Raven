const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Ensures efficient querying for recipient's unread messages
      },
      message: {
        type: String,
        required: true,
      },
      seen: {
        type: Boolean,
        default: false, // Tracks whether the message has been read
        index: true, // Improves query performance when fetching unread messages
      }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;