const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongOfPlaylist = new Schema(
	{
		playlistId: {
			type: String,
			required: true,
		},
		songs: [
			{
				songId: {
					type: String,
					required: true,
				},
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
				duration: {
					type: Number,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('SongOfPlaylist', SongOfPlaylist);
