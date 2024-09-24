const Enum = {
	user: {
		gender: {
			male: 1,
			female: 0,
		},
	},
	response: {
		success: {
			code: 200,
			mess: 'Ok',
		},
		//auth
		unauthorized: {
			code: 401,
			mess: 'The client must authenticate itself to get the requested response',
		},
		userExistedInSystem: {
			code: 402,
			mess: 'User had existed in system',
		},
		mail: {
			code: 403,
			mess: 'Error System',
		},
		otpNotMatch: {
			code: 404,
			mess: 'OTP not match',
		},
	},
};

module.exports = Enum;
