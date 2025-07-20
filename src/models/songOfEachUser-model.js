const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongOfEachUser = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		songsId: {
			type: [String],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('SongOfEachUser', SongOfEachUser);
