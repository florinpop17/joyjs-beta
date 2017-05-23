module.exports = (io) => {
    let users = [];
    let messages = [];

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
            let message = {
                username: socket.username,
                text: message_text,
                time: new Date()
            }

            messages.push(message);
            messages = messages.slice(-200); // only keep the last 200 messages

            io.emit('all messages', messages);
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
