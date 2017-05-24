import React, { Component } from 'react';

import './InfoModal.css';

class InfoModal extends Component {
    render() {
        return (
            <div className="modal-container">
                <div id="infoModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Game informations</h4>
                            </div>
                            <div className="modal-body">
                                <h3 className="text-center">Welcome to JoyJS</h3>
                                <p>This is a Trivia-like JavaScript based game. You can answer random JS questions and receive points based on your answer.</p>
                                <p>You can also add your own questions to the game which will be reviewed by an admin. If the question passes the reviewing process, it will be added to the game.</p>
                                <hr />
                                <h4>Available slash commands:</h4>
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <h4 className="list-group-item-heading">/ans <em> your_answer</em></h4>
                                        <p className="list-group-item-text">- answer the questions</p>
                                    </div>
                                    <div className="list-group-item">
                                        <h4 className="list-group-item-heading">/score</h4>
                                        <p className="list-group-item-text">- receive the number of points you currently have</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" data-toggle="modal" data-target="#infoModal" className="btn btn-primary btn-sm btn-block">Game info</button>
            </div>
        );
    }
}

export default InfoModal;
