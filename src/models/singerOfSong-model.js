const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SingerOfSong = new Schema(
	{
		songId: {
			type: String,
			required: true,
		},
		singers: [
			{
				singerId: {
					type: String,
					required: true,
				},
				singerName: {
					type: String,
					required: true,
				},
				singerAvatar: {
					type: String,
					required: true,
				},
				singerCover: {
					type: [String],
					required: true,
				},
				singerDescription: {
					type: String,
					required: true,
				},
				followers: {
					type: Number,
				},
				socials: {
					type: Object,
				},
				status: {
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

module.exports = mongoose.model('singerOfSong', SingerOfSong);
