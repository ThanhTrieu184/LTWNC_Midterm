const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.room = require("./room");
db.user_room = require("./user_room");
db.message = require("./message");

module.exports = db;
