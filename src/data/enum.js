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
			code: '403_EMAIL',
			mess: 'Error Mail System',
		},
		userHasNotExistedInSystem: {
			code: '404_EXISTED_IN_SYSTEM',
			mess: 'User Had Not Existed In System',
		},
		wrongPassword: {
			code: '405_WRONG_PASSWORD',
			mess: 'Wrong Password',
		},
		status: {
			lock: 0,
			active: 1,
			inActive: 2,
		},
		role: {
			admin: 0,
			normal: 1,
		},
	},
	singer: {
		status: {
			lock: 0,
			active: 1,
			inActive: 2,
		},
	},
	topic: {
		status: {
			hidden: 0,
			display: 1,
		},
	},
	genre: {
		status: {
			hidden: 0,
			display: 1,
		},
	},
	song: {
		type: {
			mp3: 0,
			video: 1,
		},
		status: {
			hidden: 0,
			display: 1,
		},
	},
	playList: {
		status: {
			hidden: 0,
			display: 1,
			user: 2,
		},
		songBelongUser: {
			no: 0,
			yes: 1,
		},
	},
	response: {
		success: {
			code: '200',
			mess: 'Ok',
		},
		//auth
		unauthorized: {
			code: '401_AUTH',
			mess: 'The client must authenticate itself to get the requested response',
		},
		otpNotMatch: {
			code: '404_NOT_MATCH',
			mess: 'OTP Not Match',
		},
		systemError: {
			code: '405_SYSTEM',
			mess: 'System Error',
		},
		sort: {
			desc: -1,
			asc: 1,
		},
	},
};

module.exports = Enum;
