import React, { Component } from 'react';

class Error extends Component {

    render() {
        const { message } = this.props;

        return (
            <div className="message-box message-box-error row">
                <div className="col-sm-12 message">
                    <h4 dangerouslySetInnerHTML={ { __html: message.author } } />
                    <p dangerouslySetInnerHTML={ { __html: message.text } } />
                    <h6>{ message.time }</h6>
                </div>
            </div>
        )
    }
}

export default Error;
