const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    date_created: { type: Date, default: Date.now },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
