module.exports = (io) => {
    const Question = require('./models/questionModel');
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
            let gameInterval = setInterval(game, config.roundTime);
        });

    // random question
    let getRandomQuestion = () => {
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // the game loop
    let game = () => {

        currentQuestion = getRandomQuestion();
        answeredCorrectly = false;

        let { text, author } = currentQuestion;

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

            if(isSlash(message_text)) {

                // check if the slash command is '/ans'
                if(message_text.slice(0, 4) === '/ans'){

                    // check if the answer is correct
                    let ans = message_text.slice(4); // get all characters after '/ans'
                    ans = ans.trim(); // trim the answer

                    if(ans === currentQuestion.correct_answer) {

                    } else {
                        let message = {
                            text: "You have entered a wrong answer. Please try again!",
                            type: "error"
                        }
                        
                        socket.emit("solo message", message);
                    }
                } else {
                    let message = {
                        text: "Slash command doesn't exist",
                        type: "error"
                    }

                    socket.emit("solo message", message);
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
});
}
