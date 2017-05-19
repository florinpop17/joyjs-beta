const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const PORT = process.env.PORT || 3000;

// database
mongoose.connect('http://locahost:')
mongoose.Promise = global.Promise;
const db = mongoose.connect(config.MONGO_URL);

// Models
const Question = require('./models/questionModel.js');

// variables
let users = [];
let messages = [];
let questions = [];
let currentQuestion;
let answeredCorrectly = false;

// save question from database;
Question.find((err, allQuestions) => {
    questions = allQuestions;
});

// Get random question from database
let getRandomQuestion = () => {
    return questions[Math.floor(Math.random() * questions.length)];
}

// Middlewares
app.use(express.static(__dirname + '/../client/build'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const questionRouter = require('./routes/questionRouter')(Question);
app.use('/api/questions', questionRouter);


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/../client/build/index.html');
});

let game = () => {

    currentQuestion = getRandomQuestion();
    if(currentQuestion){
        answeredCorrectly = false;

        let { text, creator } = currentQuestion;

        // create question type message
        let questionMessage = {
            text,
            author: 'Question',
            time: new Date(),
            type: 'question',
            creator
        }

        messages.push(questionMessage);

        io.emit('messages', messages);
    }
}

// send message every 60 seconds
let gameInterval = setInterval(game, config.roundTime);

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
                if(!answeredCorrectly && currentQuestion){
                    
                    if(message === currentQuestion.correct){
                        newMessage = {
                            text: `<strong>${socket.username}</strong> answered correctly! New round begins shortly...`,
                            author: "Joy ^_^",
                            time: new Date(),
                            type: "info"
                        }

                        answeredCorrectly = true;

                        // restart game
                        clearInterval(gameInterval);
                        setTimeout(() => {
                            game();
                            gameInterval = setInterval(game, config.roundTime);
                        }, config.breakTime);
                    } else { // the answer wasn't correct
                        // send back to the user that he answered incorrectly
                        newMessage = {
                            text: `I'm sorry <strong>${socket.username}</strong>. You have entered a wrong answer.`,
                            author: "Joy ^_^",
                            time: new Date(),
                            type: "error"
                        }
                    }
                }
            }

        } else {
            newMessage = {
                text: message,
                author: socket.username,
                time: new Date(),
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

server.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
