import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';

import Chat from './components/Chat';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

class App extends Component {
	constructor() {
		super();

		this.state = {
			isAuth: true
		}
	}

	render() {
		const { isAuth } = this.state;

		return (
			<Router>
				<div className="container-fluid">
					<div className="row-fluid">
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
	                                </ul>
								) : ''}
                            </div>
                        </nav>

						<Switch>
							<Route exact path="/" render={() => {
								return isAuth ? <Chat /> : <Home />
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
