const db = require("../models");
const Message = db.message;
const moment = require("moment");

exports.createMessage = (msg, user_id, room_id) => {
  const message = new Message({
    content: msg,
    created_at: moment().format("DD/MM/YYYY:h:mm:ss a"),
    user_id: user_id,
    room_id: room_id,
  });

  message.save();
};
