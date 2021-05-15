
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
});

// //SENDING MESSAGES
chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if(message.value) {
    //EMIT MESSAGE TO SERVER
    socket.emit("message", message.value);
    message.value = "";

  };

});
  
//SET SCROLLER POSITION
socket.on("message", msg => {
  outputMessage(msg);
  chat.scrollTop = chat.scrollHeight;
});


//PRINT MESSAGE
function outputMessage(message) {
    let str = message.text;
    let result = str.fontcolor(`"${message.color}"`);
    
    chat.insertAdjacentHTML("beforeend", `
    <p class="sent-message"><span class="msgDetails">${message.username} ${message.time}</span><br /> 
    ${result}</p>`);
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