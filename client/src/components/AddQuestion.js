import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddQuestion extends Component {
    render() {
        const { username } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <h4>Add new question:</h4>
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>
            </div>
        )
    }
}

AddQuestion.propTypes = {
    username: PropTypes.string.isRequired
}

export default AddQuestion;
