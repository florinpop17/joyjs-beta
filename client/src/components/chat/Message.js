import React, { Component } from 'react';
import icon from './icon-user.png'

class Message extends Component {
    render() {
        const { message } = this.props;

        return(
            <div className="chat-message">
                <div className="row">
                    <div className="col-sm-1">
                        <img className="user-logo" src={icon} alt="user logo"/>
                    </div>
                    <div className="col-sm-11">
                        <strong>{ message.username }</strong>
                        <p>{ message.text }</p>
                        <small>{ new Date(message.time).toLocaleTimeString() }</small>
                    </div>
                </div>
            </div>
        )
    }
}

export default Message;
