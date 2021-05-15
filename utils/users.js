const users = [];
//connect to database??

function userJoin(id, username, room, color) {
    const user = {id, username, room, color};
    users.push(user);
    console.log('users', users);
    return user;
};

//GET CURRENT USER
function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

//USER LEAVES CHAT
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0]
    };
};

//GET ROOM USERS
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
};