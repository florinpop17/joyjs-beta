import React, { Component } from 'react';

class Question extends Component {

    render() {
        const { message } = this.props;

        return (
            <div className="message-box message-box-question row">
                <div className="col-sm-12 message">
                    <h4>{ message.author }</h4>
                    <p dangerouslySetInnerHTML={ { __html: message.text } } />
                    <small>{ message.time }</small>
                </div>
            </div>
        )
    }
}

export default Question;
