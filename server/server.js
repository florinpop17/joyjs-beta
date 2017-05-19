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
let roundTime = 60000; // 60 seconds / game
let answeredCorrectly = false;

let getRandomQuestion = () => {
    let random = Math.floor(Math.random() * questions.length);
    return { text: questions[random].text, correct: questions[random].correct };
}

let game = () => {
    answeredCorrectly = false;
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
let gameInterval = setInterval(game, roundTime);

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

        // check if the message has the correct answer and it was not answeredCorrectly yet
        if(!answeredCorrectly && currentQuestion && message === currentQuestion.correct){
            newMessage = {
                text: `<strong>${socket.username}</strong> answered correctly! New round begins shortly...`,
                author: "The server",
                time: new Date().toLocaleTimeString(),
                type: "info"
            }

            answeredCorrectly = true;

            // restart game
            clearInterval(gameInterval);
            gameInterval = setInterval(game, roundTime);
            setTimeout(game, 15000);

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
    })
});
