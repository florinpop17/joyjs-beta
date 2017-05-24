import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import config from './config';
import io from 'socket.io-client';

import Game from './components/Game';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Dashboard from './components/Dashboard';
import AddQuestion from './components/AddQuestion';

class App extends Component {
	constructor() {
		super();

		this.state = {
			isAuth: false,
			isAdmin: false,
			socket: undefined,
			users: [],
			messages: [],
			username: undefined
		}
	}

	handleAuthentication = () => {
		let token = localStorage.getItem('token');
		axios.post(`${config.API_URL}/api/auth/checkToken`, { token })
			.then(res => {
				if(res.data.success) {

					const socket = io.connect(config.API_URL);
					const username = localStorage.getItem('username');

					// send the username to the socket server
					socket.emit('username', username);

					this.checkAdmin(token);

					this.setState({
						isAuth: true,
						socket,
						username
					});

					this.handleSocketRequests(socket);

				} else {
					this.setState({
						isAuth: false,
						socket: undefined
					});
				}
			});


	}

	checkAdmin = (token) => {

		axios.post(`${config.API_URL}/api/users/me`, { token })
			.then(res => {
				if(res.data.success) {
					this.setState({
						isAdmin: res.data.user.admin
					});
				}
			});
	}

	handleSocketRequests = (socket) => {
		socket.on('all users', (users) => {
			this.setState({
				users
			});
		});

		socket.on('all messages', (messages) => {
			this.setState({
				messages
			});
		});

		socket.on('solo message', (message) => {
			let { messages } = this.state;

			messages.push(message);

			this.setState({
				messages
			})
		});
	}

	handleLogout = () => {
		const { socket } = this.state;

		socket.emit('remove user');

		localStorage.removeItem('token');
		localStorage.removeItem('username');
		this.setState({
			isAuth: false,
			isAdmin: false,
			socket: undefined,
			username: undefined,
			messages: [],
			users: []
		});
	}

	componentDidMount() {
		this.handleAuthentication();
	}

	render() {
		const { isAuth, isAdmin, socket, users, messages, username } = this.state;

		return (
			<Router>
				<div className="container-fluid">
					<div className="row">
                        <nav className="navbar navbar-default">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse" aria-expanded="false">
                                    <span className="sr-only"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                            </div>
                            <div className="collapse navbar-collapse" id="collapse">
                                <ul className="nav navbar-nav">
                                    <li><Link to="/">Home</Link></li>
                                </ul>
								{ isAuth ? (
	                                <ul className="nav navbar-nav navbar-right">
										<li><Link to="/leaderboard">Leaderboard</Link></li>
										<li><Link to="/add">Add Question</Link></li>
										{ isAdmin ? (
											<li><Link to="/dashboard">Dashboard</Link></li>
										) : ''}
										<li><Link to="/" onClick={this.handleLogout}>Logout</Link></li>
	                                </ul>
								) : ''}
                            </div>
                        </nav>

						<Switch>
							<Route exact path="/" render={() => {
								return isAuth ? <Game socket={socket} users={users} messages={messages} /> : <Home authenticate={this.handleAuthentication}/>
							}} />
							<Route path="/leaderboard" render={() => {
								return isAuth ? <Leaderboard /> : <Redirect to="/" />
							}} />
							<Route path="/dashboard" render={() => {
								return isAuth && isAdmin ? <Dashboard /> : <Redirect to="/" />
							}} />
							<Route path="/add" render={() => {
								return isAuth ? <AddQuestion username={username} /> : <Redirect to="/" />
							}} />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
