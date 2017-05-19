const express = require('express');
const questionRouter = express.Router();

module.exports = (Question) => {
    questionRouter.route('/')
        .get((req, res) => {
            Question.find((err, questions) => {
                if (err) return res.json({ succes: false, message: err });
                return res.json({ success: true, questions });
            })
        })
        .post((req, res) => {
            const { text, correct, creator } = req.body;

            Question.create({ text, correct, creator }, (err, question) => {
                if (err) return res.json({ success: false, message: err });
                return res.json({ success: true, message: 'Question was created successfully!', question });
            });
        });

    return questionRouter;
}
