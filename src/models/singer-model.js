const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Singer = new Schema(
	{
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
	{
		timestamps: true,
	},
);
Singer.index({ singerName: 'text' });

module.exports = mongoose.model('singer', Singer);
