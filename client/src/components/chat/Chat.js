import React, { Component } from 'react';

import './Chat.css';
import Message from './Message';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import InfoMessage from './InfoMessage';
import Question from './Question';

class Chat extends Component {
    componentDidUpdate() {
        console.log('CDU');
        this.scrollBottom();
    }

    componentDidMount() {
        console.log('CDM');
        this.scrollBottom();
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

    scrollBottom = () => {
        let to_scroll = document.getElementById('to_scroll');

        if(to_scroll)
            to_scroll.scrollTop = to_scroll.scrollHeight;
    }

    render() {
        const { messages } = this.props;
        return (
            <div className="chat-container">
                <div className="chat-display" id="to_scroll">
                    { messages.map((message, idx) => {
                        // check for different types of messages
                        if(message.type === 'question') {
                            return <Question message={message} key={idx} />
                        }

                        if(message.type === 'error') {
                            return <ErrorMessage message={message} key={idx} />
                        }

                        if(message.type === 'success') {
                            return <SuccessMessage message={message} key={idx} />
                        }

                        if(message.type === 'info') {
                            return <InfoMessage message={message} key={idx} />
                        }

                        return <Message message={message} key={idx} />
                    }) }
                </div>
                <form className="chat-form" onSubmit={this.sendMessage}>
                    <input ref="message" type="text" className="form-control" placeholder="Insert your message here..."/>
                </form>
            </div>
        )
    }
}

export default Chat;
