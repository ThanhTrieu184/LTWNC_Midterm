const mongoose = require("mongoose");

const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    roomName: String,
  })
);

module.exports = Room;
