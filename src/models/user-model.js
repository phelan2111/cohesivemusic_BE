const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		email: {
			type: String,
		},
		phone: {
			type: Number,
		},
		password: {
			type: String,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		token: {
			type: String,
		},
		gender: {
			type: Number,
		},
		status: {
			type: Number,
			required: true,
		},
		role: {
			type: Number,
			required: true,
		},
		address: {
			type: String,
		},
		avatar: {
			type: String,
		},
		cover: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

User.index({ firstName: 'text', lastName: 'text', email: 'text' });
module.exports = mongoose.model('user', User);
