import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import config from '../config'

import Alert from './alert/Alert.js';

class Home extends Component {
	state = {
		errors: []
	}

	handleLogin = (e) => {
		e.preventDefault();
		let { login_email, login_password } = this.refs;
		let errors = [];

		login_email = login_email.value;
		login_password = login_password.value;

		if(!login_email || !validator.isEmail(login_email)) errors.push("Login email is not a valid email.");

		if(!login_password) errors.push("Password not provided for login.");

		if( errors.length === 0) { // no errors... we can call the api
			let postData = {
				email: login_email,
				password: login_password
			}
			axios.post(`${config.API_URL}/api/auth`, postData)
				.then(res => {
					if(res.data.success) {
						localStorage.setItem('token', res.data.token);
						localStorage.setItem('username', res.data.username);
						this.props.authenticate();
					} else {

						errors.push(res.data.message);
						this.setState({
							errors
						});
					}
				});
		}

		this.setState({
			errors
		});

		// remove alerts after 5 seconds
		setTimeout(() => {
			this.setState({
				errors: []
			})
		}, 5000);
	}

	handleSignUp = (e) => {
		e.preventDefault();
		let { signup_email, signup_username, signup_password, signup_password_two } = this.refs;
		let errors = [];

		signup_email = signup_email.value;
		signup_username = signup_username.value;
		signup_password = signup_password.value;
		signup_password_two = signup_password_two.value;

		if(!signup_email || !validator.isEmail(signup_email)) errors.push("Signup email is not a valid email.");

		if(!signup_username) errors.push("Username not provided for signup.");

		if(!signup_password) errors.push("Password not provided for signup.");
		// else if(signup_password.length < 6) errors.push("Password must be at least 6 characters long.");
		else if(!signup_password_two) errors.push("Reset password not provided for signup.");
		else if(!validator.equals(signup_password, signup_password_two)) errors.push("The passwords provided for signup doens't match.");

		if( errors.length === 0) { // no errors... we can call the api
			let postData = {
				email: signup_email,
				username: signup_username,
				password: signup_password
			}
			axios.post(`${config.API_URL}/api/users`, postData)
				.then(res => {
					if(res.data.success) { // all good... get the token and authenticate
						axios.post(`${config.API_URL}/api/auth`, postData)
							.then(res => {
								if(res.data.success) {
									localStorage.setItem('token', res.data.token);
									localStorage.setItem('username', res.data.username);
									this.props.authenticate();
								}
							});
					} else { // email or username already existing

						errors.push(res.data.message);
						this.setState({
							errors
						});
					}
				});
		}

		this.setState({
			errors
		});

		// remove alerts after 5 seconds
		setTimeout(() => {
			this.setState({
				errors: []
			})
		}, 5000);
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="container">
				<div className="row">
					{ errors.length > 0 ? (
						<div className="col-md-12">
							{ errors.map((message, idx) => (<Alert type="warning" message={message} key={idx}/>)) }
						</div>
					) : '' }
					<div className="col-sm-4 col-sm-offset-2">
						<form onSubmit={this.handleLogin} className="form">
							<h3>Login form</h3>
							<div className="form-group">
								<label>Email:</label>
								<input ref="login_email" type="email" className="form-control"/>
							</div>
							<div className="form-group">
								<label>Password:</label>
								<input ref="login_password" type="password" className="form-control"/>
							</div>
							<button className="btn btn-primary btn-block">Login</button>
						</form>
					</div>
					<div className="col-sm-4">
						<form onSubmit={this.handleSignUp} className="form">
							<h3>Signup form</h3>
							<div className="form-group">
								<label>Email:</label>
								<input ref="signup_email" type="email" className="form-control"/>
							</div>
							<div className="form-group">
								<label>Username:</label>
								<input ref="signup_username" type="text" className="form-control"/>
							</div>
							<div className="form-group">
								<label>Password:</label>
								<input ref="signup_password" type="password" className="form-control"/>
							</div>
							<div className="form-group">
								<label>Repeat password:</label>
								<input ref="signup_password_two" type="password" className="form-control"/>
							</div>
							<button className="btn btn-primary btn-block">Sign Up</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
