const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO and bind it to the HTTP server
const io = socketIo(server);

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Store currently connected users (unique usernames)
const connectedUsers = new Set();

// Listen for new socket connections
io.on('connection', socket => {
  console.log('A user connected 👤');

  // Handle user joining the chat (JOIN EVENT — client → server)
  socket.on('join', userName => {
    connectedUsers.add(userName);
    socket.userName = userName;

    // Notify all clients that a new user has joined (BROADCAST EVENT — server)
    io.emit('userJoined', userName);

    // Send updated user list to all connected clients
    io.emit('userList', Array.from(connectedUsers));
  });

  // Handle incoming chat messages (MESSAGE EVENT — client → server)
  socket.on('chatmessage', message => {
    // Broadcast message to all connected clients
    io.emit('chatMessage', message);
  });

  // Handle user disconnection (DISCONNECT EVENT — server)
  socket.on('disconnect', () => {
    console.log('A user disconnected 👋');

    if (socket.userName) {
      connectedUsers.delete(socket.userName);

      // Notify all users that someone has left the chat
      io.emit('userLeft', socket.userName);

      // Send updated user list to all connected clients
      io.emit('userList', Array.from(connectedUsers));
    }
  });
});

const PORT = 8080;

// Start the HTTP + Socket.IO server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} 🕸️`);
});
