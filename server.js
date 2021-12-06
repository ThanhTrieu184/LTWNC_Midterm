const path = require("path");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 1804;
const db = require("./db");
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
const config = require("./config");
const { checkLogin } = require("./middlewares/checkLogin");
const moment = require("moment");
const {
  UserController,
  MessageController,
  RoomController,
} = require("./controllers");

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ user_id, room_id }) => {
    await RoomController.joinRoom(user_id, room_id);
    const room = await RoomController.getRoomById(room_id);
    const user = await UserController.getUserById(user_id);
    const roomUsers = await RoomController.getRoomUsers(room_id);
    const msgs = await RoomController.getAllMessages(room_id);
    const messages = [];
    if (msgs) {
      msgs.map((msg) => {
        msg = formatMessage(
          msg.user_id,
          msg.username,
          msg.content,
          msg.created_at
        );
        messages.push(msg);
      });
    }
    socket.join(room_id);
    // notify to a user
    socket.emit("message", messages);
    // notify to all user
    socket.broadcast
      .to(room_id)
      .emit("message", [
        formatMessage(
          user.user_id,
          "Tin nhắn tự động",
          `${user.username} vừa tham gia phòng chat.`,
          moment().format("DD/MM/YYYY:h:mm:ss a")
        ),
      ]);
    io.to(room_id).emit("roomUsers", {
      room: room.roomName,
      users: roomUsers,
    });
  });

  socket.on("leave", async ({ user_id, room_id }) => {
    var room = await RoomController.getRoomById(room_id);
    var user = await UserController.getUserById(user_id);
    var userLeave = await RoomController.leaveRoom(user_id, room_id);
    var roomUsers = await RoomController.getRoomUsers(room_id);
    if (userLeave) {
      io.to(room_id).emit("message", [
        formatMessage(
          user.user_id,
          "Tin nhắn tự động",
          `${user.username} vừa rời khỏi phòng chat.`,
          moment().format("DD/MM/YYYY:h:mm:ss a")
        ),
      ]);
      io.to(room_id).emit("roomUsers", {
        room: room.roomName,
        users: roomUsers,
      });
    }
  });

  // listen for new chat message
  socket.on("chatMessage", async ({ msg, user_id, room_id }) => {
    const user = await UserController.getUserById(user_id);
    MessageController.createMessage(msg, user_id, room_id);
    io.to(room_id).emit("message", [
      formatMessage(
        user._id,
        user.username,
        msg,
        moment().format("DD/MM/YYYY:h:mm:ss a")
      ),
    ]);
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
server.listen(PORT, () =>
  console.log(`Server is running on  http://localhost:${PORT}`)
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser(config.cookieSecret));

app.get("/", checkLogin, async (req, res) => {
  const rooms = await RoomController.getAllRooms();
  res.render("index", {
    user_id: req.signedCookies.user.user_id,
    rooms: rooms,
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", UserController.login);

app.get("/chat", checkLogin, (req, res) => {
  res.render("chat");
});

app.post("/messages/create", MessageController.createMessage);
