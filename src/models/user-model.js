const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		phone: {
			type: Number,
			unique: true,
		},
		password: {
			type: String,
			required: true,
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
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('user', User);
