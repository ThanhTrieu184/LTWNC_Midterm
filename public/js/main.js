const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userInRoom = document.getElementById("users");
const leaveRoom = document.getElementById("leave-room");
const socket = io();

const { user_id, room_id } = Qs.parse(location.href.split("?")[1]);

socket.emit("joinRoom", { user_id, room_id });
// get room and users

socket.on("roomUsers", ({ room, users }) => {
  showRoomName(room);
  userList(users);
});

leaveRoom.addEventListener("click", (e) => {
  console.log(user_id);
  socket.emit("leave", { user_id, room_id });
});

socket.on("message", (messages) => {
  sentMessage(messages);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", { msg, user_id, room_id });

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const sentMessage = (messages) => {
  messages.map((message) => {
    const div = document.createElement("div");
    if (message.user_id == user_id) {
      div.classList.add("message");
    } else {
      div.classList.add("message-left");
    }
    div.innerHTML = `<div class="py-2 px-4 rounded-xl inline-block bg-emerald-50"><p class="text-sm font-bold text-emerald-800 text-opacity-70">${message.username}</p>
    <p class="text-left">
      ${message.text}
    </p></div><div class=""><small class="text-gray-500 px-2 font-thin"> ${message.time}</small></div>`;
    document.querySelector(".chat-messages").appendChild(div);
  });
};

const showRoomName = (room) => {
  roomName.innerText = room;
};

const userList = (users) => {
  userInRoom.innerHTML = `
    ${users
      .map(
        (user) => `<li class="py-1"><i class="fas fa-user"></i> ${user}</li>`
      )
      .join("")}
  `;
};
