var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var randomColor = require('randomcolor');
var color = randomColor();
const formatMessage = require("./utils/messages");
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const botName = "chatcord bot"
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var randomColor = require('randomcolor');
var color = randomColor();

var randomId = require('random-id');
var len = 5;

app.use('/', indexRouter);
app.use('/users', usersRouter);

const users = [];

io.on("connection", socket => {

    socket.on('joinRoom', ({username, room}) => {
        //JOIN USER
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)
        //MESSAGE WHEN USER CONNECTS
        socket.broadcast
        .to(user.room)
        .emit("message", formatMessage(botName, `${user.username.toUpperCase()} has joined the session`)); //show to all except itself
        
        //MESSAGE TO NEW USER
        socket.emit("message", formatMessage(botName, `You have joined the ${user.room.toUpperCase()} room as ${user.username.toUpperCase()}`));
        
        //USER AND ROOM INFO
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
 

    //LISTEN FOR CHAT MESSAGE
    socket.on("message", msg => {
        const user = getCurrentUser(socket.id);

        console.log('chat msg:', msg);
        io.to(user.room)
        .emit("message", formatMessage(user.username.toUpperCase(), msg)); 
    });
  
    //DISCONNECT
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room)
            .emit("message", formatMessage(botName, `${user.username.toUpperCase()} has left the chat`));
        
            //USER AND ROOM INFO
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }

    });

});
  



module.exports = {app: app, server: server};
