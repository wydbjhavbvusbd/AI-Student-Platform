const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./public/config/db');
const Message = require('./model/Message');
const authRoutes = require('./model/routes/auth');
const multer = require('multer');
const userroutes = require('../model/user');
const {OpenAI}=require('openai');

require('dentv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
connectDB();

app.use('/api/auth', authRoutes);

// Serve frontend
app.use(express.static('public'));

app.get('/messages', async (req, res) => {

    const messages = await Message.find()
        .sort({ createdAt: 1 });

    res.json(messages);

});

app.post('/upload', upload.single('file'), (req, res) => {

    res.json({
        file: req.file.filename
    });
});

app.post('/ai', async (req, res) => {

    const { prompt } = req.body;

    const response = await client.chat.completions.create({

        model: 'gpt-4.1-mini',

        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    });

    res.json({
        reply: response.choices[0].message.content
    });
});

io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);

socket.on('chat message', async (data) => {

    // Save message to MongoDB
    const newMessage = new Message(data);

    await newMessage.save();

    // Send message to everyone
    io.emit('chat message', data);

});

    });

    socket.on('disconnect', () => {

        console.log('User disconnected');

    });


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

let onlineUsers = [];

//inside connection
onlineUsers.push(socket.id);

io.emit('online users', onlineUsers.length);

//inside disconnect
onlineUsers = onlineUsers.filter(
    id => id !== socket.id
);

io.emit('online users', onlineUsers.length);

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const PORT = 5000;

server.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);


});  