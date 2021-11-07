const config = require("./config");
const mongoose = require("mongoose");
const User = require("./models/user");
const Room = require("./models/room");
const bcrypt = require("bcrypt");
const connectionString = config.mongo.connectionString;

if (!connectionString) {
  console.error("MongoDB connection string missing!");
  process.exit(1);
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB error: " + err.message);
  process.exit(1);
});

db.once("open", () => console.log("MongoDB connection established"));
User.find(async (err, users) => {
  if (err) return console.error(err);
  if (users.length) return;
  const newUsers = [
    { username: "user", password: await hashPassword("123456") },
    { username: "user2", password: await hashPassword("123456") },
    { username: "user3", password: await hashPassword("123456") },
  ];
  User.insertMany(newUsers);
});
Room.find((err, rooms) => {
  if (err) return console.error(err);
  if (rooms.length) return;
  const newRooms = [
    { roomName: "Room1" },
    { roomName: "Room2" },
    { roomName: "Room3" },
    { roomName: "Room4" },
    { roomName: "Room5" },
  ];
  Room.insertMany(newRooms);
});

const hashPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
};
