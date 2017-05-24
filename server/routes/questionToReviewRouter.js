const express = require('express');
const questionToReviewRouter = express.Router();

const QuestionToReview = require('../models/questionToReviewModel');
const Question = require('../models/questionModel');

questionToReviewRouter.route('/')
	.get((req, res) => {
		QuestionToReview.find({})
			.select('author correct_answer text id')
			.exec((err, questions) => {
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

questionToReviewRouter.route('/accept/:id')
	.delete((req, res) => {
		// delete this question and save it to the Question collection, because it was approved by an admin
		const { id } = req.params;

		QuestionToReview.findByIdAndRemove(id, (err, removedQuestion) => {
			if (err) return res.json({ success: false, message: err });

			let { author, correct_answer, text } = removedQuestion;

			Question.create({ author, text, correct_answer }, (err, question) => {
				if (err) return res.json({ success: false, message: err });
				return res.json({ success: true, question });
			});
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
