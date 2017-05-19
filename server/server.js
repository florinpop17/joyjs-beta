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
let roundTime = 10000; // 60 seconds / game
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
        let newMessage = undefined;

        // trim message
        message = message.trim();

        // check if it is a slash command
        // slash commands start with `/`
        if(message[0] === '/') {

            // check if the slash is `/ans`
            if(message.slice(0, 4) === '/ans'){
                // remove /ans from the message and trim to remove spaces
                message = message.slice(4).trim();

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
                    setTimeout(() => {
                        game();
                        gameInterval = setInterval(game, roundTime);
                    }, 15000);

                }
            }

        } else {
            newMessage = {
                text: message,
                author: socket.username,
                time: new Date().toLocaleTimeString(),
                type: "message"
            }
        }

        // check to see if the newMessage has value
        // if doesn't don't emit anything
        if(newMessage){
            messages.push(newMessage);

            io.emit('messages', messages);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.username} disconnected.`);
        users.splice(users.indexOf(users.find(user => user.id === socket.id)), 1);
    })
});
