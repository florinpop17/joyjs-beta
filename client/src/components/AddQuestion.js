import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import marked from 'marked';
import config from '../config';

import './AddQuestion.css';
import GuideModal from './modal/GuideModal';
import Alert from './alert/Alert';

class AddQuestion extends Component {
    state = {
        output: '',
        errors: [],
        success: ''
    }

    handleInputChange = () => {
        let { output } = this.state;
        let { text } = this.refs;
        const { username } = this.props;

        text = text.value;

        if(text) {
            output = `<h4>Question <small>Created by: <strong>${username}</strong></small></h4>`;
            output += marked(text);

            this.setState({
                output
            });
        }
    }

    submitQuestion = () => {
        let { text, correct_answer } = this.refs;
        let { errors, output } = this.state;
        const { username } = this.props;

        text = text.value;
        correct_answer = correct_answer.value;

        if(!text) errors.push('Your question field is empty.');
        if(!correct_answer) errors.push('Your question needs a correct answer.');

        if(errors.length === 0) { // we don't have erors
            let question = {
                text: output,
                correct_answer,
                author: username
            }

            axios.post(`${config.API_URL}/api/questionsToReview`, question)
                .then(res => {
                    if(res.data.success) {

                        // send a success message
                        this.setState({
                            success: 'Thank you for your contribution. The question will be reviewed by an admin! ^_^'
                        })

                        // clear the inputs
                        this.refs.text.value = '';
                        this.refs.correct_answer.value = '';
                    }
                });
        }

        this.setState({
            errors
        });

        // remove alerts after 5 seconds
        setTimeout(() => {
            this.setState({
                errors: [],
                success: ''
            })
        }, 5000);
    }

    componentDidMount() {
        const { username } = this.props;

        this.setState({
            output: `<h4>Question <small>Created by: <strong>${username}</strong></small></h4>`
        })
    }

    render() {
        const { output, errors, success } = this.state;
        return (
            <div className="container">
                <div className="row add-question-container">

                    { errors.length > 0 ? (
                        <div className="col-md-12">
                            { errors.map((error, idx) => (<Alert type="warning" message={error} key={idx}/>)) }
                        </div>
                    ) : '' }
                    { success ? (
                        <div className="col-ms-12">
                            <Alert type="success" message={success} />
                        </div>
                    ) : '' }

                    <div className="col-sm-6">
                        <h4>Insert your question: *</h4>
                        <div className="form-group">
                            <textarea ref="text" className="form-control" onChange={this.handleInputChange} required="true"></textarea>
                        </div>
                        <h4>Correct answer: *</h4>
                        <div className="form-group">
                            <input ref="correct_answer" className="form-control" onChange={this.handleInputChange} required="true"/>
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
