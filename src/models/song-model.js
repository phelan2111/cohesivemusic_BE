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
		link: {
			type: String,
			required: true,
		},
		lyrics: {
			type: String,
		},
		status: {
			type: Number,
			required: true,
		},
		views: {
			type: Number,
		},
		type: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

Song.index({ songName: 'text' });


module.exports = mongoose.model('Song', Song);
