import React, { Component } from 'react';

import './chat.css';

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
                    <div className="server-message">
                        Hello from server!
                    </div>
                    { messages.map((message, idx) => (
                        <div className="chat-message" key={idx}>
                            <p><strong>{ message.username }: </strong> { message.text } <small className="pull-right">{ new Date(message.time).toLocaleTimeString() }</small></p>
                        </div>
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
