const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);
const dgram = require('dgram');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const UDP_PORT = 41234;

// Створення UDP сервера
const udpClient = dgram.createSocket('udp4');

// Обробка Socket.io з'єднань
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('send_message', (data) => {
    console.log('Message received:', data);

    // Відправка повідомлення через UDP
    const message = JSON.stringify({ title: data.title, message: data.message, fcmToken: data.fcmToken });
    udpClient.send(message, UDP_PORT, 'localhost', (err) => {
      if (err) {
        console.error('Error sending UDP message:', err);
      }
    });

    socket.emit('response', 'Message sent to server 2 via UDP');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server 1 is running on port 4000');
});
