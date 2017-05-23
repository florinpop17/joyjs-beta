const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const User = require('../models/userModel');

authRouter.route('/')
    .post((req, res) => {
        const { email, password } = req.body;

        if(!email) return res.json({ success: false, message: "Please provide email!" });
        if(!password) return res.json({ success: false, message: "Please provide password!" });

        User.findOne({ email }, (err, user) => {
            if (err) return res.json({ success: false, message: err });

            if (!user) return res.json({ success: false, message: 'Authentication failed. Email not found, please signup.' });
            else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return res.json({ success: false, message: err });

                    if (!isMatch) return res.json({ success: false, message: 'Incorrect password.' });

                    // create token
                    const token = jwt.sign(user._id, config.SECRET, {
                        expiresIn: 10080 // expires in 7 days
                    });

                    res.header("x-access-token", token);

                    // return the token
                    return res.json({ success: true, message: 'Enjoy your token!', token, username: user.username });
                });
            }
        });
    });

authRouter.route('/checkToken')
    .post((req, res) => {

        // check header or url parameters or post parameters for token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.SECRET, (err, decoded) => {
                if (err) return res.json({ success: false, message: 'Failed to authenticate token.', err: err })
                else {

                    // uf everything is good, save to request for use in other routes
                    return res.json({ success:true, message:'Token is correct' });
                }
            });
        } else {
            // no token, return an error
            return res.json({ success: false, message: 'No token provided.' });
        }
    });

module.exports = authRouter;
