import React, { Component } from 'react';

import Message from './components/Message';
import Question from './components/Question';
import Info from './components/Info';
import Error from './components/Error';

class App extends Component {
    constructor() {
        super();

        this.state = {
            users: [],
            messages: [],
            socket: undefined
        }

        this.addMessageHandler = this.addMessageHandler.bind(this);
        this.addUsernameHandler = this.addUsernameHandler.bind(this);
    }

    scrollBottom() {
        // when new message commes in, scroll to bottom
        let bottom = document.getElementById("always-on-bottom");
        bottom.scrollTop = bottom.scrollHeight;

    }

    addMessageHandler(e) {
        e.preventDefault();
        let message = this.refs.message.value;
        if(message) {
            const { socket } = this.state;

            // emit new message
            socket.emit("new message", message);

            // clear the input
            this.refs.message.value = '';
        }

    }

    addUsernameHandler(e) {
        e.preventDefault();
        let username = this.refs.username.value;
        if(username) {
            let socket = window.io.connect('http://localhost:3000/');
            socket.username = username;

            socket.emit('username', username);

            socket.on('messages', (messages) => {

                this.setState({
                    messages
                });
            });

            socket.on('users', (users) => {

                this.setState({
                    users
                })
            })

            this.setState({
                socket
            })

            socket.on('disconnect', () => {
                // server stopped, set socket to undefined to send user back to login menu
                this.setState({
                    socket: undefined
                })
            })
        }
    }

    componentDidUpdate() {
        // only scrollBottom when socket is available => user is logged in
        const { socket } = this.state;
        if(socket){
            this.scrollBottom();
        }
    }

    render() {
        const { socket, messages, users } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <h1 className="text-center">Welcome to JoyJS</h1>
                    { !socket ? (
                        <form className="login-form col-sm-4 col-sm-offset-4" onSubmit={this.addUsernameHandler}>
                            <div className="form-group">
                                <input ref="username" type="text" className="form-control" placeholder="Pick a username" required/>
                            </div>
                            <button className="btn btn-primary btn-block">Enter</button>
                        </form>
                    ) : messages ? (
                        <div className="chat-container">
                            { users ? (
                                <div className="users-container">
                                    <h5>Active users:</h5>
                                    { users.map((user, idx) => (
                                        <span key={idx}>{ user }</span>
                                    ))}
                                </div>
                            ) : '' }

                            <div className="messages-container container" id="always-on-bottom">
                                { messages.map((message, idx) => {

                                    // convert time to local string
                                    message.time = new Date(message.time).toLocaleTimeString();

                                    if(message.type === 'message'){
                                        return <Message message={message} key={idx} />;
                                    }
                                    if(message.type === 'question'){
                                        return <Question message={message} key={idx} />;
                                    }
                                    if(message.type === 'info'){
                                        return <Info message={message} key={idx} />;
                                    }
                                    if(message.type === 'error'){
                                        return <Error message={message} key={idx} />;
                                    }
                                    return '';
                                }) }
                                <div className="row">
                                    <div className="col-sm-12">
                                        <form onSubmit={this.addMessageHandler}>
                                            <input ref="message" type="text" className="form-control" placeholder="Insert your message" required/>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : '' }
                </div>
            </div>
        );
    }
}

export default App;
