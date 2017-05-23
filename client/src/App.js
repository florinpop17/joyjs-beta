import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import axios from 'axios';

import Chat from './components/Chat';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

class App extends Component {
	constructor() {
		super();

		this.state = {
			isAuth: false
		}
	}

	handleAuthentication = () => {
		let token = localStorage.getItem('token');
		axios.post('http://localhost:3000/api/auth/checkToken', { token })
			.then(res => {
				if(res.data.success) {
					this.setState({ isAuth: true });
				} else {
					this.setState({ isAuth: false });
				}
			});
	}

	handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		this.setState({ isAuth: false });
	}

	componentDidMount() {
		this.handleAuthentication();
	}

	render() {
		const { isAuth } = this.state;

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
										<li><Link to="/" onClick={this.handleLogout}>Logout</Link></li>
	                                </ul>
								) : ''}
                            </div>
                        </nav>

						<Switch>
							<Route exact path="/" render={() => {
								return isAuth ? <Chat /> : <Home authenticate={this.handleAuthentication}/>
							}} />
							<Route path="/leaderboard" render={() => {
								return isAuth ? <Leaderboard /> : <Redirect to="/" />
							}} />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
