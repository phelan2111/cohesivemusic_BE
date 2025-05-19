const logger = require('../utils/logger');
const axios = require('axios');

async function VerifyTokenGG(accessToken) {
	try {
		logger.info('Middleware execute VerifyTokenGG');
		const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: {
				Authorization: accessToken,
			},
		});
		const userInfo = res.data;
		return {
			success: true,
			user: userInfo,
		};
	} catch (error) {
		logger.error('Middleware execute VerifyTokenGG error', error);
	}
}

module.exports = VerifyTokenGG;
