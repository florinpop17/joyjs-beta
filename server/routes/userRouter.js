const express = require('express');
const userRouter = express.Router();

module.exports = (User) => {
    userRouter.route('/')
        .post((req, res) => {
            const { email, username, password } = req.body;

            User.create({ email, username, password }, (err, user) => {
                if (err) return res.json({ success: false, message: err });
                return res.json({ success: true, message: 'User was created successfully!', question user
            });
        });

    userRouter.route('/:id')
        .get((req, res) => {
            User.find({ _id: id }, (err, user) => {
                if (err) return res.json({ succes: false, message: err });
                return res.json({ success: true, user });
            })
        })

    return userRouter;
}
