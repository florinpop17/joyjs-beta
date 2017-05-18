import React, { Component } from 'react';

class Message extends Component {

    render() {
        const { message } = this.props;

        return (
            <div className="message-box row">
                <div className="col-sm-1 text-center">
                    <img className="user-logo" src="http://tbchr.com/themes/img/icon-user.png" alt="user logo"/>
                </div>
                <div className="col-sm-11 message">
                    <h4>{ message.author }</h4>
                    <p>{ message.text }</p>
                    <small>{ message.time }</small>
                </div>
            </div>
        )
    }
}

export default Message;
