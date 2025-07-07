const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
mongoose.connect('mongodb+srv://chatappuser:chatpass123@cluster0.gnwf9ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: Date
});
const Message = mongoose.model('Message', MessageSchema);

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', async (msg) => {
    const newMsg = new Message({ ...msg, timestamp: new Date() });
    await newMsg.save();
    io.emit('chat message', newMsg);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
