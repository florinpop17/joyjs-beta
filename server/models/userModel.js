const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	points: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: new Date
	}
})

module.exports = mongoose.model('User', UserSchema);
