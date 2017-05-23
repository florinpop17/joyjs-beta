import React, { Component } from 'react';

import './chat.css';
import Message from './Message';

class Chat extends Component {
    componentDidUpdate() {
        let to_scroll = document.getElementById('to_scroll');
        if(to_scroll)
            to_scroll.scrollTop = to_scroll.scrollHeight;
    }

    componentDidMount() {
        this.refs.message.focus();
    }

    sendMessage = (e) => {
        e.preventDefault();
        const { message } = this.refs;

        if(message.value){
            this.props.handleMessage(message.value);
            message.value = '';
        }
    }

    render() {
        const { messages } = this.props;
        return (
            <div className="chat-container">
                <div className="chat-display" id="to_scroll">
                    { messages.map((message, idx) => (
                        <Message message={message} key={idx}/>
                    )) }
                </div>
                <form className="chat-form" onSubmit={this.sendMessage}>
                    <input ref="message" type="text" className="form-control" placeholder="Insert your message here..."/>
                </form>
            </div>
        )
    }
}

export default Chat;
