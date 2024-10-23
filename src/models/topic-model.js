const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Topic = new Schema(
	{
		topicName: {
			type: String,
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

module.exports = mongoose.model('topic', Topic);
