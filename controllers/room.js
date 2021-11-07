const db = require("../models");
const Message = db.message;
const User_Room = db.user_room;
const Room = db.room;
const User = db.user;

exports.joinRoom = async (user_id, room_id) => {
  const user = await User.findById(user_id);
  const room = await Room.findById(room_id);
  const user_room = new User_Room({ user_id: user._id, room_id: room._id });

  User_Room.findOne({ user_id: user_id, room_id: room_id }, (err, u_r) => {
    if (err) {
      console.log(err);
    }
    if (!u_r) {
      user_room.save().catch((err) => {
        console.log(err);
      });
    }
  });
};

exports.getRoomById = async (id) => {
  return Room.findById(id);
};

exports.getRoomUsers = async (id) => {
  const roomUserIds = await User_Room.find({ room_id: id });
  const roomUsers = [];
  await Promise.all(
    roomUserIds.map(async (obj) => {
      const user = await User.findById(obj.user_id);
      roomUsers.push(user.username);
    })
  );
  return roomUsers;
};

exports.leaveRoom = async (user_id, room_id) => {
  const user = User_Room.findOneAndDelete({
    user_id: user_id,
    room_id: room_id,
  });
  return user;
};

exports.getAllRooms = async () => {
  return Room.find().lean();
};

exports.getAllMessages = async (room_id) => {
  const Messages = await Message.find({ room_id: room_id });
  const roomMessages = [];
  await Promise.all(
    Messages.map(async (obj) => {
      const user = await User.findById(obj.user_id);
      roomMessages.push({
        room_id: obj.room_id,
        user_id: obj.user_id,
        content: obj.content,
        created_at: obj.created_at,
        username: user.username,
      });
    })
  );
  return roomMessages;
};
