const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    date_created: { type: Date, default: Date.now },
    text: { type: String, required: true },
    correct: { type: String, required: true },
    creator: { type: String, default: "Joy ^_^" }
});

module.exports = mongoose.model('Question', QuestionSchema);
