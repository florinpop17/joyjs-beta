const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const questions = require('./questions');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

app.use(express.static(__dirname + '/../client/build'))

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/../client/build/index.html');
});

let users = [];
let messages = [];
let currentQuestion;

let getRandomQuestion = () => {
    let random = Math.floor(Math.random() * questions.length);
    return { text: questions[random].text, correct: questions[random].correct };
}

let game = () => {
    let randomQuestion = getRandomQuestion();
    let { text, correct } = randomQuestion;

    // create question type message
    let questionMessage = {
        text,
        author: 'Question',
        time: new Date().toLocaleTimeString(),
        type: 'question'
    }

    currentQuestion = randomQuestion;

    messages.push(questionMessage);

    io.emit('messages', messages);
}

// send message every 60 seconds
let qInterval = setInterval(game, 60000);

// start game
game();

io.on('connection', (socket) => {
    // when user connects, emit the messages
    socket.emit('messages', messages);

    // get username from client and save the socket
    socket.on('username', (username) => {
        socket.username = username;
        users.push(socket);
    })

    // when new message comes, save it and emit all the other messages
    socket.on('new message', (message) => {
        let newMessage;

        // check if the message has the correct answer
        if(currentQuestion && message === currentQuestion.correct){
            newMessage = {
                text: `<strong>${socket.username}</strong> answered correctly!`,
                author: "The server",
                time: new Date().toLocaleTimeString(),
                type: "info"
            }
        } else {
            newMessage = {
                text: message,
                author: socket.username,
                time: new Date().toLocaleTimeString(),
                type: "message"
            }
        }

        messages.push(newMessage);

        io.emit('messages', messages);
    });

    socket.on('disconnect', () => {
        users.splice(users.indexOf(users.find(user => user.id === socket.id)), 1);
        console.log(users.map(user => user.id));
    })
});
