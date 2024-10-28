const User = require('../models/user-model');
const OTP = require('../models/otp-model');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');
const ServiceUser = require('../services/user');
const config = require('../config');

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
					} else {
						res.json({
							...Enum.response.otpNotMatch,
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
				cover: config.development.defaultImage.cover,
				avatar: config.development.defaultImage.avatar,
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

	//[POST]-[/user/details]
	details(req, res, next) {
		const { userId } = req.query;

		User.findOne({ _id: userId })
			.then((userItem) => {
				res.json({
					...Enum.response.success,
					data: ServiceUser.convertResponseGenre(userItem),
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	getList(req, res, next) {
		logger.info('Controller user execute getList');
		const { from, limit, status = Enum.user.status.active, search = '', ...rest } = req.query;

		const query = Helper.search(search, {
			status,
		});

		User.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((dataItem) => {
				const list = dataItem.map((i) => {
					const user = i;
					user.token = '';
					delete user.token;
					return user;
				});
				User.countDocuments(query)
					.exec()
					.then((total) => {
						res.json({
							...Enum.response.success,
							data: {
								total,
								list,
							},
						});
					});
			});
	}
}
module.exports = new UserController();
