const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Browse = new Schema(
	{
		nameBrowse: {
			type: String,
			required: true,
		},
		imageBrowse: {
			type: String,
			required: true,
		},
		playlistId: {
			type: [String],
		},
		status: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('browse', Browse);
