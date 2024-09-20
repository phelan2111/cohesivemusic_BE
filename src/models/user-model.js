const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		gender: {
			type: Number,
			required: true,
		},
		playlistId: {
			type: String,
			unique: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('user', User);
