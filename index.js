const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {pingTimeout: 1000, pingInterval: 1000});

// io.set('heartbeat timeout', 50000);
// io.set('heartbeat interval', 2000);

let connectedUsers = {};

io.on('connection', (socket) => {

  let user = {};
  user.color = makeRandomColor();
  user.id = socket.id;
  connectedUsers[socket.id] = user;

  io.emit('user', connectedUsers);

  socket.on('disconnect', function() {
    delete connectedUsers[socket.id];
    io.emit('user', connectedUsers);
  });

  socket.on('add-message', (message) => {
    io.emit('message', {user: connectedUsers[socket.id], text: message});
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('started on port 3000');
});

function makeRandomColor() {
  return '#'+Math.random().toString(16).slice(-3);
}
