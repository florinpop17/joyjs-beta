import React, { Component } from 'react';

class QuestionMessage extends Component {
    render() {
        const { message } = this.props;

        return(
            <div className="chat-message chat-message-question">
                <div className="row">
                    <div className="col-sm-12">
                        <h4>Question <small>Created by: <strong>{ message.author }</strong></small></h4>
                        <div dangerouslySetInnerHTML={{ __html: message.text }} />
                        <span>{ new Date(message.time).toLocaleTimeString() }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuestionMessage;
