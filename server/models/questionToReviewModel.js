const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionToReviewSchema = new Schema({
	author: {
		type: String,
		default: "Joy ^_^"
	},
	text: {
		type: String,
		required: true
	},
	correct_answer: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: new Date
	}
});

module.exports = mongoose.model('QuestionToReview', QuestionToReviewSchema);
