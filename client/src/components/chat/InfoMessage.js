import React, { Component } from 'react';

class InfoMessage extends Component {
    render() {
        const { message } = this.props;

        return(
            <div className="chat-message chat-message-info">
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

export default InfoMessage;
