const User = require('../models/user-model');
const OTP = require('../models/otp-model');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');

class UserController {
	verifyUsername(req, res, next) {
		try {
			logger.info('Controller user execute verify username');
			logger.debug('Controller user get request from client', req.body);
			const { email } = req.body;
			User.findOne({ email }).then((user) => {
				const hasUserExist = Helper.isEmpty(user);
				if (!hasUserExist) {
					res.json({
						...Enum.user.userExistedInSystem,
					});
				} else {
					const otpRandom = Helper.randomOTP();
					OTP.findOne({ email })
						.then((otpFindOne) => {
							if (!Helper.isEmpty(otpFindOne)) {
								otpFindOne.otp = otpRandom;
								otpFindOne.save();
							} else {
								const otpScheme = new OTP({
									email,
									otp: otpRandom,
								});
								otpScheme.save();
							}
						})
						.then(() => {
							ServiceCommon.resendEmail({
								to: email,
								subject: 'Your OTP',
								message: `<p>Your OTP is: <strong>${otpRandom}</strong></p>`,
							})
								.then(() => {
									logger.info('Controller user execute MiddlewareResendEmail success');
									res.json({
										...Enum.response.success,
										data: {
											email,
											token: Helper.generateToken(
												{
													email,
												},
												5,
											),
										},
									});
								})
								.catch(() => {
									res.json({
										...Enum.user.userExistedInSystem,
									});
								});
						})
						.catch((error) => {
							logger.error(error.message);
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
		}
	}
	7;

	verifyOTP(req, res, next) {
		try {
			logger.info('Controller user execute verify OTP');
			logger.debug('Controller user execute verify OTP', req.body);
			const { otp } = req.body;
			const { email } = req.user;
			OTP.findOne({ otp })
				.then((otpFindOne) => {
					if (!Helper.isEmpty(otpFindOne)) {
						logger.info('Controller user execute verify OTP success');
						res.json({
							...Enum.response.success,
							data: {
								email,
								token: Helper.generateToken(
									{
										email,
									},
									30,
								),
							},
						});
					}
				})
				.catch(() => {
					res.json({
						...Enum.response.otpNotMatch,
					});
				});
		} catch (error) {
			logger.error(error.message);
		}
	}

	register(req, res, next) {
		try {
			logger.info('Controller user execute register');
			const { password, firstName, lastName } = req.body;
			const { email } = req.user;
			const userScheme = new User({
				password,
				firstName,
				lastName,
				email,
				status: Enum.user.status.inActive,
				role: Enum.user.role.normal,
			});
			userScheme
				.save()
				.then(() => {
					res.json({
						...Enum.response.success,
					});
				})
				.catch((error) => {
					logger.error('Controller user execute register', error);
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error('Controller user execute register', error.message);
		}
	}

	login(req, res, next) {
		try {
			const { id, password, ...rest } = req.body;
			const token = Helper.generateToken(
				{
					...rest,
					password,
					id,
				},
				1800,
			);

			User.findByIdAndUpdate(id, { token, status: Enum.user.status.active })
				.then((user) => {
					const response = {
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						gender: user.gender,
						playlistId: user.playlistId,
						role: user.role,
					};
					res.json({
						...Enum.response.success,
						data: {
							...response,
							token,
						},
					});
				})
				.catch((error) => {
					logger.error('Controller user execute login', error);
					res.json({ ...Enum.response.systemError });
				});
		} catch (error) {
			logger.error('Controller user execute login', error.message);
		}
	}

	information(req, res, next) {
		res.json({
			email: 'Ly minh tan',
			password: '$2y$13$tck7GmMrUMhLGPO5Qn4NAu53nAVa..kJqTq/RiNZ28N/l1P3Nd.TK',
		});
	}

	getList(req, res, next) {
		logger.info('Controller user execute getList');
		User.find({}).then((dataItem) => {
			const data = dataItem.map((i) => {
				const user = i;
				user.token = '';
				delete user.token;
				return user;
			});
			res.json({
				...Enum.response.success,
				data: {
					total: dataItem.length,
					list: data,
				},
			});
		});
	}
}
module.exports = new UserController();
