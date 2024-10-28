const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Genre = new Schema(
	{
		nameGenre: {
			type: String,
			required: true,
		},
		imageGenre: {
			type: String,
			required: true,
		},
		topicId: {
			type: String,
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

Genre.index({ nameGenre: 'text' });

module.exports = mongoose.model('genre', Genre);
