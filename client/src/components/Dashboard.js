import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

class Dashboard extends Component {
    state = {
        redirect: false,
        questionsToReview: []
    }

    componentDidMount() {
        this.getQuestions();
    }

    getQuestions = () => {
        // get token
        let token = localStorage.getItem('token');

        // check if user is Admin
		axios.post(`${config.API_URL}/api/users/me`, { token })
			.then(res => {
				if(res.data.user.admin) {

                    axios.get(`${config.API_URL}/api/questionsToReview/`)
                        .then(res => {
                            this.setState({
                                questionsToReview: res.data.questions
                            })
                        });

				} else {
                    // is not admin. push it to homepage
                    this.setState({
                        redirect: true
                    })
                }
			});
    }

    handleAccept = (id) => {
        axios.delete(`${config.API_URL}/api/questionsToReview/accept/${id}`)
            .then(res => {
                if(res.data.success){
                    this.getQuestions();
                }
            });
    }

    handleDecline = (id) => {
        axios.delete(`${config.API_URL}/api/questionsToReview/${id}`)
            .then(res => {
                if(res.data.success){
                    this.getQuestions();
                }
            });
    }

    render() {
        const { redirect, questionsToReview } = this.state;
        return (
            <div className="container">
                <div className="row">
                    { redirect ? (
                        <Redirect to="/" />
                    ) : (
                        <div className="col-md-12">
                            <h1>Questions to review</h1>
                            { questionsToReview.length > 0 ? (
                                <div className="questions-container">
                                    { questionsToReview.map(question => (
                                        <div className="panel panel-primary" key={ question._id }>
                                            <div className="panel-heading">
                                                <h4 className="panel-title">Question by <strong>{ question.author }</strong></h4>
                                            </div>
                                            <div className="panel-body">
                                                <div dangerouslySetInnerHTML={{ __html:question.text }}/>
                                            </div>
                                            <div className="panel-footer clearfix">
                                                Correct answer: <strong>{ question.correct_answer }</strong>
                                                <div className="btn-group pull-right">
                                                    <button onClick={() => this.handleAccept(question._id)} className="btn btn-success btn-xs">Accept</button>
                                                    <button onClick={() => this.handleDecline(question._id)} className="btn btn-danger btn-xs">Decline</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) }
                                </div>
                            ) : 'No more questions to review.' }
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Dashboard;
