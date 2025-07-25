const dotenv = require('dotenv');
//env
dotenv.config();

module.exports = {
	development: {
		db: {
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		},
		port: process.env.PORT,
		smpt: {
			host: process.env.SMPT_HOST,
			port: process.env.SMPT_PORT,
			mail: process.env.SMPT_MAIL,
			appPass: process.env.SMPT_APP_PASS,
		},
		cloudinary: {
			cloudName: process.env.CLOUD_NAME,
			apiKey: process.env.API_KEY,
			apiSecret: process.env.API_SECRET,
		},
		defaultImage: {
			cover: process.env.COVER_DEFAULT,
			avatar: process.env.AVATAR_DEFAULT,
			playlist: process.env.PLAYLIST_DEFAULT,
		},
	},
};
