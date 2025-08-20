const User = require('../models/user-model');
const OTP = require('../models/otp-model');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');
const ServiceUser = require('../services/user');
const config = require('../config');
const bcrypt = require('bcryptjs');
const VerifyTokenGG = require('../middleware/google');
const helper = require('../utils/helper');
const Playlist = require('../models/playlist-model');
const SongOfPlaylist = require('../models/songOfPlaylist-model');

class UserController {
	//[POST]-[/user/verifyUsername]
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
								message: `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ii-HUB ZMA Worldfone User Information</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f0f0f0; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f0f0f0;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="padding: 30px 40px 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); border-radius: 8px; display: inline-block; text-align: center; line-height: 40px; font-weight: bold; color: white; font-size: 18px;">
                                            ii
                                        </div>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="font-size: 24px; font-weight: bold; color: #333333; line-height: 1.2;">
                                            ii-HUB
                                            <div style="font-size: 12px; color: #ff6b6b; font-weight: normal;">
                                                DATA SCIENCE
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <!-- Title -->
                            <h1 style="color: #333333; font-size: 28px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.3;">
                                Thông tin người dùng liên hệ nhận tư vấn từ <span style="color: #2765F2;">ZMA Worldfone</span>
                            </h1>
                            
                            <!-- User Information -->
                            <div style="margin-bottom: 30px;">
                                <p style="color: #333333; font-size: 14px; margin: 0 0 15px 0; line-height: 1.5;">
                                    <strong>Thân gửi:</strong> <span style="color: #343535; font-weight: bold;">[Tên Admin]</span>
                                    <br />
                                    Chúng tôi vừa nhận được thông tin từ người dùng qua đăng ký trên <strong>Zalo Mini App</strong> của <strong>Worldfone</strong>. Chi tiết như sau:
                                </p>
                                
                                <!-- User Details -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin-bottom: 25px;">
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Tên doanh nghiệp:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Tên doanh nghiệp]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Họ và tên:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Họ và Tên người dùng]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Số điện thoại:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Số điện thoại]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Email:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Email người dùng]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Khu vực:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Tên khu vực]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Lời nhắn:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Nhu cầu hoặc yêu cầu của người dùng]</span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Additional Information -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin-bottom: 25px;">
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; width: 130px; vertical-align: top;">
                                            Nguồn truy cập:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; font-weight: bold;">
                                            <span style="color: #343535;">[Mini App Worldfone trên nền tảng Zalo]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #333333; font-size: 14px; padding: 5px 0; width: 130px; vertical-align: top;">
                                            Ngày và giờ gửi:
                                        </td>
                                        <td style="color: #333333; font-size: 14px; padding: 5px 0; font-weight: bold;">
                                            <span style="color: #343535;">[Ngày giờ]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <p style="color: #333333; font-size: 14px; margin: 0 0 30px 0; line-height: 1.5;">
                                                <span>Vui lòng kiểm tra và phản hồi lại người dùng trong thời gian sớm nhất.</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                
                            </div>
                            
                            <!-- Footer Message -->
                            <p style="color: #3A3A3A; font-size: 14px; margin: 0 0 8px 0; line-height: 1.5;">
                                <span>Trân trọng cảm ơn!</strong>
                                <br />
                                <strong>Team ii-HUB</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html>`,
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
							res.json({
								...Enum.user.userExistedInSystem,
							});
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.user.userExistedInSystem,
			});
		}
	}

	//[POST]-[/user/resendOTP]
	resendOTP(req, res, next) {
		try {
			logger.info('Controller user execute verify username');
			logger.debug('Controller user get request from client', req.body);
			const { email } = req.body;
			const otpRandom = Helper.randomOTP();
			OTP.findOneAndUpdate({ email }, { otp: otpRandom })
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
		} catch (error) {
			logger.error(error.message);
		}
	}

	//[POST]-[/user/verifyOTP]
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
									5,
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

	//[POST]-[/user/register]
	register(req, res, next) {
		try {
			logger.info('Controller user execute register');
			const { password, firstName, lastName } = req.body;
			const { email } = req.user;
			const userScheme = new User({
				password: bcrypt.hashSync(password, 10),
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
				.then((user) => {
					const playList = new Playlist({
						viewSaves: 0,
						userId: user._id.toString(),
						songs: [],
						status: Enum.playList.status.liked,
						descriptionPlaylist: 'Liked',
						image: config.development.defaultImage.playlist,
						theme: 'Liked',
						namePlaylist: 'Liked Songs',
					});
					playList
						.save()
						.then((item) => {
							const songOfPlaylist = new SongOfPlaylist({
								playlistId: item._id,
								songs: [],
							});
							songOfPlaylist.save().then(() => {
								res.json({
									...Enum.response.success,
								});
							});
						})
						.catch((error) => {
							throw new Error(error);
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

	//[POST]-[/user/loginWithGG]
	loginWithGG(req, res, next) {
		try {
			logger.info('Controller user execute registerWithGG');
			VerifyTokenGG(req.headers?.token)
				.then((dataItem) => {
					const infoUser = {
						password: dataItem.user?.sub,
						firstName: dataItem.user?.family_name,
						lastName: dataItem.user?.given_name,
						email: dataItem.user?.email,
						status: Enum.user.status.active,
						role: Enum.user.role.normal,
						cover: config.development.defaultImage.cover,
						avatar: dataItem.user?.picture,
					};

					User.findOne({ email: dataItem.user?.email }).then((user) => {
						logger.info('Controller user execute registerWithGG', user);
						if (helper.isEmpty(user)) {
							const userScheme = new User({
								...infoUser,
							});
							userScheme
								.save()
								.then((user) => {
									const token = Helper.generateToken(
										{
											...infoUser,
											userId: user._id.toString(),
										},
										1800,
									);
									User.findByIdAndUpdate(user._id.toString(), { token }).then(() => {
										const playList = new Playlist({
											viewSaves: 0,
											userId: user._id.toString(),
											songs: [],
											status: Enum.playList.status.liked,
											descriptionPlaylist: 'Liked',
											image: config.development.defaultImage.playlist,
											theme: 'Liked',
											namePlaylist: 'Liked Songs',
										});
										playList
											.save()
											.then((item) => {
												const songOfPlaylist = new SongOfPlaylist({
													playlistId: item._id,
													songs: [],
												});
												songOfPlaylist.save().then(() => {
													res.json({
														...Enum.response.success,
														data: {
															token,
															info: { ...infoUser, userId: user._id.toString() },
														},
													});
												});
											})
											.catch((error) => {
												throw new Error(error);
											});
									});
									
								})
								.catch((error) => {
									logger.error('Controller user execute register', error);
									res.json({
										...Enum.response.systemError,
									});
								});
						} else {
							const token = Helper.generateToken(
								{
									...infoUser,
									userId: user._id.toString(),
								},
								1800,
							);
							User.findOneAndUpdate({ _id: user._id.toString() }, { token, status: Enum.user.status.active })
								.then((user) => {
									const response = {
										email: user.email,
										firstName: user.firstName,
										lastName: user.lastName,
										gender: user.gender,
										playlistId: user.playlistId,
										role: user.role,
										avatar: user.avatar,
										userId: user._id.toString(),
									};
									res.json({
										...Enum.response.success,
										data: {
											info: response,
											token,
										},
									});
								})
								.catch((error) => {
									logger.error('Controller user execute login', error);
									res.json({ ...Enum.response.systemError });
								});
						}
					});
				})
				.catch(() => {
					logger.error('UserValidator execute verifyTokenGG fail');
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error('Controller user execute register', error.message);
		}
	}

	//[POST]-[/user/login]
	login(req, res, next) {
		try {
			const { userId, password, ...rest } = req.body;
			const token = Helper.generateToken(
				{
					...rest,
					password,
					userId,
				},
				1800,
			);

			User.findByIdAndUpdate(userId, { token, status: Enum.user.status.active })
				.then((user) => {
					const response = {
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						gender: user.gender,
						playlistId: user.playlistId,
						role: user.role,
						avatar: user.avatar,
					};
					res.json({
						...Enum.response.success,
						data: {
							info: response,
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

	//[GET]-[/user/details]
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

	//[GET]-[/user]
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

	//[POST]-[/user]
	update(req, res, next) {
		const { userId, ...rest } = req.body;

		User.findByIdAndUpdate(userId, rest)
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/user/upload]
	upload(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'user/image',
			use_filename: true,
		})
			.then((data) => {
				res.json({
					...Enum.response.success,
					data: {
						link: data.url,
						name: data.original_filename,
						createAt: new Date(data.created_at).getTime(),
					},
				});
			})
			.catch((error) => {
				logger.error(error);

				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[PUT]-[/user]
	createByBackOffice(req, res, next) {
		logger.info('Controller singer execute createByBackOffice image username');
		logger.debug('Controller singer get request from client', req.body);
		const { cover, avatar, ...rest } = req.body;

		//create construct
		const scheme = {
			...rest,
		};
		if (cover) {
			scheme.cover = cover;
		}
		if (avatar) {
			scheme.avatar = avatar;
		}

		//create scheme
		const userScheme = new User({
			...scheme,
			status: Enum.user.status.inActive,
		});

		//random password and hash 10
		const password = bcrypt.hashSync(Helper.randomOTP(), 10);

		// send email service
		ServiceCommon.resendEmail({
			to: rest.email,
			subject: 'General password',
			message: `<p>Your password is: <strong>${password}</strong></p>`,
		})
			.then(() => {
				logger.info('Controller user execute MiddlewareResendEmail success');
				userScheme
					.save()
					.then((user) => {
						logger.info('Controller user execute scheme user');
						res.json({
							data: {
								userId: user._id,
							},
							...Enum.response.success,
						});
					})
					.catch((error) => {
						logger.error('Controller user execute createByBackOffice', error);
						res.json({
							...Enum.response.systemError,
						});
					});
			})
			.catch(() => {
				logger.error('Controller user execute createByBackOffice', error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[DELETE]-[/genre]
	updateStatus(req, res, next) {
		const { userId, status } = req.body;

		User.findByIdAndUpdate(userId, { status })
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/user/forgot]
	forgot(req, res, next) {
		try {
			logger.info('Controller user execute forgot');
			logger.debug('Controller user execute forgot', req.body);
			const { email } = req.body;
			User.findOne({ email }).then((user) => {
				const hasUserExist = Helper.isEmpty(user);
				if (hasUserExist) {
					res.json({
						...Enum.user.userExistedInSystem,
					});
				} else {
					const token = Helper.generateToken(
						{
							email,
						},
						5,
					);
					ServiceCommon.resendEmail({
						to: email,
						subject: 'Reset password',
						message: `<p>
						<a href="https://cohesivemusic.vercel.app/kyc/reset/${token}">
						click here to reset password</a>
						</p>`,
					})
						.then(() => {
							logger.info('Controller user execute MiddlewareResendEmail success');
							res.json({
								...Enum.response.success,
							});
						})
						.catch(() => {
							res.json({
								...Enum.user.userExistedInSystem,
							});
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/user/reset]
	reset(req, res, next) {
		try {
			logger.info('Controller user execute reset');
			logger.debug('Controller user execute reset', req.body);
			const { password } = req.body;
			const { email } = req.user;

			User.findByIdAndUpdate({ email }, { password: bcrypt.hashSync(password, 10) })
				.then(() => {
					res.json({
						...Enum.response.success,
					});
				})
				.catch(() => {
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}
module.exports = new UserController();
