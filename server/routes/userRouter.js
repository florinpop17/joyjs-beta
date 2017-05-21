const express = require('express');
const userRouter = express.Router();

const User = require('../models/userModel');

userRouter.route('/')
	.get((req, res) => {
		User.find({}, (err, users) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, users });
		});
	})
	.post((req, res) => {
		const { email, username, password } = req.body;

		User.create({ email, username, password }, (err, user) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, user });
		});
	});

userRouter.route('/get_user/:id')
	.get((req, res) => {
		const { id } = req.params;

		User.findById(id, (err, user) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, user });
		});
	})
	.patch((req, res) => {
		const { id } = req.params;
		const { email, username, password } = req.body;

		let updatedUser = {};

		if(email) updatedUser.email = email;
		if(username) updatedUser.username = username;
		if(password) updatedUser.password = password;

		User.findByIdAndUpdate(id, updatedUser, (err, user) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, user });
		});
	})
	.delete((req, res) => {
		const { id } = req.params;

		User.findByIdAndRemove(id, (err, user) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, user });
		});
	})

userRouter.route('/leaderboard/')
	.get((req, res) => {
		User.find({})
			.sort('-points')
			.limit(10)
			.select('username points')
			.exec((err, users) => {
				if (err) return res.json({ success: false, message: err });
				return res.json({ success:true, leaderboard: users });
			});
	});

module.exports = userRouter;
