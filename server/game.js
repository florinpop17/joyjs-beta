module.exports = (io) => {
    const Question = require('./models/questionModel');
    const User = require('./models/userModel');
    const config = require('./config');

    let questions = [];
    let users = [];
    let messages = [];
    let currentQuestion = undefined;
    let answeredCorrectly = false;
    let gameInterval = undefined;

    // get all questions from database
    Question.find({})
        .select('author text correct_answer')
        .exec((err, all) => {
            questions = all;

            game();

            // game loop every 60 seconds
            gameInterval = setInterval(game, config.roundTime);
        });

    // random question
    let getRandomQuestion = () => {
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // the game loop
    let game = () => {
        let text = '';
        let author = '';

        console.log('game...');

        currentQuestion = getRandomQuestion();
        answeredCorrectly = false;

        // { text, author } = currentQuestion;
        if (currentQuestion) {
            text = currentQuestion.text;
            author = currentQuestion.author;
        }

        // create question type message
        let questionMessage = {
            text,
            author,
            username: 'Joy ^_^',
            time: new Date(),
            type: 'question'
        }

        messages.push(questionMessage);
        messages = messages.slice(-200); // only keep the last 200 messages

        io.emit('all messages', messages);
    }

    let isSlash = (text) => {
        return text[0] === '/';
    }

    io.on('connection', (socket) => {
        socket.on('username', (username) => {
            console.log(`Username ${username}, joined the game.`);
            socket.username = username;

            users.push(socket.username);

            // send all the available users to frontend
            // but filter the usernames, because they might have two browsers opened
            io.emit('all users', users); //.filter((item, idx, arr) => arr.indexOf(item) === idx));
            io.emit('all messages', messages); // send all messages to the user when he logs in

            console.log('Available users', users);
        });

        socket.on('chat message', (message_text) => {
            message_text = message_text.trim(); // remove spaces

            // check for the case when the user might remain on the frontend with no username when the server shutsdown
            if(socket.username) {

                // check for valid slash command
                if(isSlash(message_text)) {

                    // check if the slash command is '/ans'
                    if(message_text.slice(0, 4) === '/ans'){

                        if(!answeredCorrectly) { // the game is running

                            // check if the answer is correct
                            let ans = message_text.slice(4); // get all characters after '/ans'
                            ans = ans.trim(); // trim the answer

                            // lowercase and check answers
                            if(ans.toLowerCase() === currentQuestion.correct_answer.toLowerCase()) {

                                // reset game
                                answeredCorrectly = true;

                                clearInterval(gameInterval);
                                setTimeout(() => {
                                    game();
                                    gameInterval = setInterval(game, config.roundTime);
                                }, config.breakTime);

                                // give point to the user
                                User.findOneAndUpdate({ username: socket.username }, { $inc: { "points": 1 }} )
                                    .exec((err, user) => {

                                        // it might happen to get a user to be undefined if the server stops and the socket is still connected
                                        // to prevent this, we check if it is a user
                                        if (user) {
                                            let message = {
                                                text: `Congratulations <strong>${user.username}</strong>! You got it right!! <br /> You now have <strong>${user.points + 1}</strong> points. New round starts soon...`,
                                                time: new Date(),
                                                type: "success"
                                            }

                                            messages.push(message);
                                            messages = messages.slice(-200); // only keep the last 200 messages

                                            io.emit("all messages", messages);
                                        }
                                    });

                            } else {
                                sendErrorMessage("Wrong answer... Please try again!");
                            }
                        } else { // the game is not running
                            sendErrorMessage("Hold on cowboy! The round is not yet started!");
                        }

                    // check if the slash command is /score
                    } else if(message_text.slice(0, 6) === '/score') {
                        User.findOne({ username: socket.username })
                            .select('points')
                            .exec((err, user) => {
                                sendInfoMessage(`You currently have <strong>${user.points}</strong> points. Keep playing for more! ^_^`);
                            });
                    } else {
                        sendErrorMessage("Slash command doesn't exist.");
                    }
                } else {
                    let message = {
                        username: socket.username,
                        text: message_text,
                        time: new Date()
                    }

                    messages.push(message);
                    messages = messages.slice(-200); // only keep the last 200 messages

                    io.emit('all messages', messages);
                }
            } else {
                sendErrorMessage("The server restarted, please refresh the page!");
            }
        });

        socket.on('remove user', () => { // duplicate of the disconnect because socket.emit('disconnect') doesn't work on client
        console.log('remove user is called');
        console.log(`Username ${socket.username}, left the game.`);

        if(users.indexOf(socket.username) > -1) // if user exists remove it from users array
        users.splice(users.indexOf(socket.username), 1);

        io.emit('all users', users);

        console.log('Available users', users);
    })

    socket.on('disconnect', () => {
        console.log(`Username ${socket.username}, left the game.`);

        if(users.indexOf(socket.username) > -1) // if user exists remove it from users array
        users.splice(users.indexOf(socket.username), 1);

        io.emit('all users', users);

        console.log('Available users', users);
    });

    // helper errorMessage
    let sendErrorMessage = (text) => {
        let message = {
            text,
            time: new Date(),
            type: "error"
        }

        socket.emit("solo message", message);
    }

    // helper infoMessage
    let sendInfoMessage = (text) => {
        let message = {
            text,
            time: new Date(),
            type: "info"
        }

        socket.emit("solo message", message);
    }

});
}
