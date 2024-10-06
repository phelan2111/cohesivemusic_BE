const Enum = {
	user: {
		gender: {
			male: 1,
			female: 0,
		},
		userExistedInSystem: {
			code: 402,
			mess: 'User Had Existed In System',
		},
		mail: {
			code: 403,
			mess: 'Error Mail System',
		},
		userHasNotExistedInSystem: {
			code: 404,
			mess: 'User Had Not Existed In System',
		},
		wrongPassword: {
			code: 405,
			mess: 'Wrong Password',
		},
		status: {
			lock: 0,
			active: 1,
		},
	},
	attribute: {
		status: {
			hidden: 0,
			display: 1,
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
		otpNotMatch: {
			code: 404,
			mess: 'OTP Not Match',
		},
		systemError: {
			code: 405,
			mess: 'System Error',
		},
	},
};

module.exports = Enum;
