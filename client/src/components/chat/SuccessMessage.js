import React, { Component } from 'react';

class SuccessMessage extends Component {
    render() {
        const { message } = this.props;

        return(
            <div className="chat-message chat-message-success">
                <div className="row">
                    <div className="col-sm-12">
                        <div dangerouslySetInnerHTML={{ __html: message.text }} />
                        <span>{ new Date(message.time).toLocaleTimeString() }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SuccessMessage;
