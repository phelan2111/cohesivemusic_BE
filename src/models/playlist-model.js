const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Playlist = new Schema(
	{
		namePlaylist: {
			type: String,
			required: true,
		},
		descriptionPlaylist: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
		},
		songs: {
			type: [String],
			required: true,
		},
		theme: {
			type: String,
			required: true,
		},
		viewSaves: {
			type: Number,
			required: true,
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

Playlist.index({ namePlaylist: 'text' });

module.exports = mongoose.model('playlist', Playlist);
