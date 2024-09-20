const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		email: {
			type: string,
			unique: true,
			required: true,
		},
		password: {
			type: string,
			required: true,
		},
		token: {
			type: string,
			required: true,
		},
		gender: {
			type: number,
			required: true,
		},
		playlistId: {
			type: string,
			unique: true,
		},
	},
	{
		timestamps: 'created_at',
	},
);

module.exports = mongoose.model('user', User);
