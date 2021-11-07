const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    content: String,
    created_at: String,
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = Message;
