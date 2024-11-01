const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreOfSinger = new Schema(
	{
		singerId: {
			type: String,
			required: true,
		},
		genres: [
			{
				nameGenre: {
					type: String,
					required: true,
				},
				imageGenre: {
					type: String,
					required: true,
				},
				status: {
					type: Number,
					required: true,
				},
				genreId: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('genreOfSinger', GenreOfSinger);
