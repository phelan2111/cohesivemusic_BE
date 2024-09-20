const dotenv = require('dotenv');
//env
dotenv.config();

module.exports = {
	development: {
		db: {
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		},
	},
};
