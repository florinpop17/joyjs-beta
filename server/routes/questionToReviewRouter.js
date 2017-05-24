const express = require('express');
const questionToReviewRouter = express.Router();

const QuestionToReview = require('../models/questionToReviewModel');

questionToReviewRouter.route('/')
	.get((req, res) => {
		QuestionToReview.find({}, (err, questions) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, questions });
		});
	})
	.post((req, res) => {
		const { author, text, correct_answer } = req.body;

		QuestionToReview.create({ author, text, correct_answer }, (err, question) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, question });
		});
	});

questionToReviewRouter.route('/:id')
	.delete((req, res) => {
		const { id } = req.params;

		QuestionToReview.findByIdAndRemove(id, (err, question) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, question });
		});
	});

module.exports = questionToReviewRouter;
