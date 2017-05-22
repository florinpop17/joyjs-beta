const express = require('express');
const questionRouter = express.Router();

const Question = require('../models/questionModel');

questionRouter.route('/')
	.get((req, res) => {
		Question.find({}, (err, questions) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, questions });
		});
	})
	.post((req, res) => {
		const { author, text, correct_answer } = req.body;

		Question.create({ author, text, correct_answer }, (err, question) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, question });
		});
	});

questionRouter.route('/:id')
	.get((req, res) => {
		const { id } = req.params;

		Question.findById(id, (err, question) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, question });
		});
	})
	.patch((req, res) => {
		const { id } = req.params;
		const { author, text, correct_answer } = req.body;

		let updatedQuestion = {};

		if(author) updatedQuestion.author = author;
		if(text) updatedQuestion.text = text;
		if(correct_answer) updatedQuestion.correct_answer = correct_answer;

		Question.findByIdAndUpdate(id, updatedQuestion, (err, question) => {
			if (err) return res.json({ success: false, message: err });

			// send back updated question
			for(let key in question){
				if(updatedQuestion.hasOwnProperty(key)) { // check if the updatedQuestion has the same properties
					question[key] = updatedQuestion[key];
				}
			}

			return res.json({ success: true, question });
		});
	})
	.delete((req, res) => {
		const { id } = req.params;

		Question.findByIdAndRemove(id, (err, question) => {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, question });
		});
	});

module.exports = questionRouter;
