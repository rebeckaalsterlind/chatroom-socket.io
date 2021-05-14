var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var randomColor = require('randomcolor');
var color = randomColor();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var randomColor = require('randomcolor');
var color = randomColor();


app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on("connection", socket => {
    socket.on("username", user => {
        console.log('username:', user);
        //io.emit("chat message", user); 
    });


    console.log('User connected');
    //o.emit("connection", "user connected"); 
    socket.broadcast.emit("connection", "New user connected"); //show to all except itself

    socket.on("chat message", msg => {
        console.log('chat msg:', msg);
        io.emit("chat message", msg); 
    });
  
    socket.on("disconnect", () => {

        io.emit("User disconnected", "User disconnected");
        console.log('msg:', "disconnected");
    });

});
  



module.exports = {app: app, server: server};
