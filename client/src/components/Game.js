import React, { Component } from 'react';

import Chat from './chat/Chat';

class Game extends Component {

	sendMessage = (message_text) => {
		let { socket } = this.props;

		socket.emit('chat message', message_text);
	}

	render() {
		const { username, users, messages } = this.props;
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-10">
						<h4>The chat</h4>
						<Chat messages={messages} handleMessage={this.sendMessage}/>
					</div>
					<div className="col-sm-2">
						<h4>Available Users:</h4>
						{ users.length > 0 ? (
							<ul className="list-group">
								{ users.map((user, idx) => (<li className="list-group-item" key={idx}>{ user }</li>)) }
							</ul>
						) : '' }
						<pre>Welcome, { username }!</pre>
					</div>
				</div>
			</div>
		);
	}
}

export default Game;
