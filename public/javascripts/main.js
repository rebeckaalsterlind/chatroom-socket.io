
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chat = document.getElementById("chat");

const chatForm = document.getElementById("chatForm");
const message = document.getElementById("message");
 
//GET USERNAME AND ROOM FROM URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//JOIN CHATROOM
socket.emit('joinRoom', {username, room})

//GET ROOM AND USERS
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users)
})
// //SENDING MESSAGES
chatForm.addEventListener("submit", (evt) => {
  
  evt.preventDefault();

  if(message.value) {
    //EMIT MESSAGE TO SERVER
    socket.emit("message", message.value);
    message.value = "";

  };

});
  

socket.on("message", msg => {
  outputMessage(msg);
  chat.scrollTop = chat.scrollHeight;
});



function outputMessage(message) {
    chat.insertAdjacentHTML("beforeend", `
    <p class="sent-message"><span class="msgDetails">${message.username} ${message.time}</span><br /> 
    ${message.text}</p>`);
};

//ADD ROOM NAME TO DOM
function outputRoomName(room) {
    roomName.innerText = room;
};

//ADD USERS TO DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}