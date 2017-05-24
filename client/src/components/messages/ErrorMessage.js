import React, { Component } from 'react';

class ErrorMessage extends Component {
    render() {
        const { message } = this.props;

        return(
            <div className="chat-message chat-message-error">
                <div className="row">
                    <div className="col-sm-12">
                        <p>{ message.text }</p>
                        <span>{ new Date(message.time).toLocaleTimeString() }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default ErrorMessage;
