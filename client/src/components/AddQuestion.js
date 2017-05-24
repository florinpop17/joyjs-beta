import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import marked from 'marked';

import './AddQuestion.css';
import GuideModal from './modal/GuideModal';

class AddQuestion extends Component {
    state = {
        output: ''
    }

    handleInputChange = () => {
        let { output } = this.state;
        let { text } = this.refs;
        const { username } = this.props;

        text = text.value;

        if(text) {
            output = `<h3>Question <small>Created by: <strong>${username}</strong></small></h3>`;
            output += marked(text);

            this.setState({
                output
            });
        }
    }

    componentDidMount() {
        const { username } = this.props;

        this.setState({
            output: `<h3>Question <small>Created by: <strong>${username}</strong></small></h3>`
        })
    }

    /*
    Model:
        <h3>Question <small>Created by: <strong>{ message.author }</strong></small></h3>
        <div dangerouslySetInnerHTML={{ __html: message.text }} />
        <span>{ new Date(message.time).toLocaleTimeString() }</span>
    */

    submitQuestion = (e) => {

    }

    render() {
        const { output } = this.state;
        return (
            <div className="container">
                <div className="row add-question-container">
                    <div className="col-sm-6">
                        <h4>Insert your question:</h4>
                        <div className="form-group">
                            <textarea ref="text" className="form-control" onChange={this.handleInputChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Correct answer:</label>
                            <input ref="correct_answer" className="form-control"  onChange={this.handleInputChange}/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h4>Output: <small>( markdown format )</small></h4>
                        <div ref="display" className="display-question" dangerouslySetInnerHTML={{ __html: output }} />
                        <button className="btn btn-primary pull-right" onClick={this.submitQuestion}>Submit</button>
                    </div>
                    <GuideModal />
                </div>
            </div>
        )
    }
}

AddQuestion.propTypes = {
    username: PropTypes.string.isRequired
}

export default AddQuestion;
