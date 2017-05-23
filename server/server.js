const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const PORT = process.env.port || 80;
const userRouter = require('./routes/userRouter');
const questionRouter = require('./routes/questionRouter');
const authRouter = require('./routes/authRouter');

const config = require('./config');

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URL);

// middleware
app.use(express.static(path.join(__dirname, '../client/build/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routers
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);

// default route
app.get("/", (req, res) => {
    // send static files
    res.send(path.join(__dirname, '../client/build/', 'index.html'));
});

// the game logic
require('./game')(io);

server.listen(PORT, () => { console.log("Application running on port "+PORT ); });
