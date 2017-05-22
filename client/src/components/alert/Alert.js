import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Alert.css';

class Alert extends Component {
    render() {
        const { type, message } = this.props;

        return(
            <div className={ `alert alert-${type}` }>{ message }</div>
        )
    }
}

Alert.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
}

export default Alert;
