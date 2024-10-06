const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Song = new Schema(
	{
		songName: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		songDescription: {
			type: String,
			required: true,
		},
		singers: {
			type: [String],
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		lyrics: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
		},
		time: {
			type: Number,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Song', Song);
