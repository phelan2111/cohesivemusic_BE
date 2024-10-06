const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attribute = new Schema(
	{
		attributeName: {
			type: String,
			required: true,
		},
		attributeImage: {
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

module.exports = mongoose.model('attribute', Attribute);
