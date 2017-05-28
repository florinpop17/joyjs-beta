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
                                <h4>Available slash commands:</h4>
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <h4 className="list-group-item-heading">/ans <em> your_answer</em></h4>
                                        <p className="list-group-item-text">- answer the questions</p>
                                    </div>
                                    <div className="list-group-item">
                                        <h4 className="list-group-item-heading">/score</h4>
                                        <p className="list-group-item-text">- receive the number of points you have</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" data-toggle="modal" data-target="#infoModal" className="btn btn-primary btn-sm btn-block">Slash commands</button>
            </div>
        );
    }
}

export default InfoModal;
