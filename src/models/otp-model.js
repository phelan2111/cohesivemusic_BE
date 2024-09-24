const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTP = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		otp: {
			type: String,
			unique: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('otp', OTP);
