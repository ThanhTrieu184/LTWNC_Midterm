const mongoose = require("mongoose");

const User_Room = mongoose.model(
  "User_Room",
  new mongoose.Schema({
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

module.exports = User_Room;
