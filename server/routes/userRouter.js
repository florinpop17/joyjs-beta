const express = require('express');
const userRouter = express.Router();

module.exports = (User) => {
    userRouter.route('/')
        .get((req, res) => {
            User.find((err, users) => {
                if (err) return res.json({ success: false, message: err });
                return res.json({ success: true, users });
            });
        })
        .post((req, res) => {
            const { email, username, password } = req.body;

            User.create({ email, username, password }, (err, user) => {
                if (err) return res.json({ success: false, message: err });
                return res.json({ success: true, message: 'User was created successfully!', user });
            });
        });

    userRouter.route('/:id')
        .get((req, res) => {
            const { id } = req.params;

            User.findOne({ _id: id }, (err, user) => {
                if (err) return res.json({ success: false, message: 'Cannot find user.' });
                return res.json({ success: true, user });
            })
        })

    return userRouter;
}
