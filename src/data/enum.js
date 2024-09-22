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
		unauthorized: {
			code: 401,
			mess: 'The client must authenticate itself to get the requested response',
		},
	},
};

module.exports = Enum;
