const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');

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

userRouter.route('/:id')
	.get((req, res) => {
		const { id } = req.params;

		User.findById(id, (err, user) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, user });
		});
	})
	.patch((req, res) => {
		const { id } = req.params;
		const { email, username, password, points } = req.body;

		let updatedUser = {};

		if(email) updatedUser.email = email;
		if(username) updatedUser.username = username;
		if(password){

			// generate a salt
			let salt = bcrypt.genSaltSync(10);

			// hash password
			let hash = bcrypt.hashSync(password, salt);

			// store hashed password
			updatedUser.password = hash;
		}
		if(points) updatedUser.points = points;

		User.findByIdAndUpdate(id, updatedUser, (err, user) => {
			if (err) return res.json({ success: false, message: err });

			// send back updated user
			for(let key in user){
				if(updatedUser.hasOwnProperty(key)) { // check if the updatedUser has the same properties
					user[key] = updatedUser[key];
				}
			}

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

userRouter.route('/leaderboard')
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
