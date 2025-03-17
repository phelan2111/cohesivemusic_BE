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
				typeSong: {
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
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('SongOfPlaylist', SongOfPlaylist);
