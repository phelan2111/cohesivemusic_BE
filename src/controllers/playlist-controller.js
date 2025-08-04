const Playlist = require('../models/playlist-model');
const SongOfPlaylist = require('../models/songOfPlaylist-model');
const SongOfEachUser = require('../models/songOfEachUser-model');
const SingerOfSong = require('../models/singerOfSong-model');
const Song = require('../models/song-model');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');
const ServicePlaylist = require('../services/playlist');
const ServiceSong = require('../services/song');
const Helper = require('../utils/helper');
const logger = require('../utils/logger');

class PlaylistController {
	//[PUT]-[/playlist]
	create(req, res, next) {
		const { singers, songs, ...rest } = req.body;
		const { id } = req.user;

		try {
			Song.find({ _id: { $in: songs } })
				.then((itemsSong) => {
					const convertSong = itemsSong.map((song) => ServiceSong.convertResponseSong(song));
					const playList = new Playlist({
						...rest,
						viewSaves: 0,
						userId: id,
						songs,
						status: Enum.playList.status.display,
					});
					playList
						.save()
						.then((item) => {
							const songOfPlaylist = new SongOfPlaylist({
								playlistId: item._id,
								songs: convertSong,
							});
							songOfPlaylist.save().then(() => {
								res.json({
									...Enum.response.success,
									data: {
										playlistId: item._id,
									},
								});
							});
						})
						.catch((error) => {
							throw new Error(error);
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/playlist]
	update(req, res, next) {
		const { playlistId, ...rest } = req.body;

		try {
			Song.find({ _id: { $in: rest.songs } })
				.then((itemsSong) => {
					const convertSong = itemsSong.map((song) => ServiceSong.convertResponseSong(song));
					Playlist.findByIdAndUpdate(playlistId, rest)
						.then(() => {
							SongOfPlaylist.findOneAndUpdate({ playlistId }, { songs: convertSong })
								.then((dataItem) => {
									res.json({
										...Enum.response.success,
										data: {
											playlistId,
										},
									});
								})
								.catch(() => {
									throw new Error(error);
								});
						})
						.catch((error) => {
							throw new Error(error);
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/playlist/uploadCover]
	uploadCover(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);

		try {
			ServiceCommon.uploadImage(req.file.path, {
				folder: 'playlist/image/cover',
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
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[DELETE]-[/playlist]
	updateStatus(req, res, next) {
		const { playlistId, status } = req.body;

		try {
			Playlist.findByIdAndUpdate(playlistId, { status })
				.then(() => {
					res.json({
						...Enum.response.success,
						data: {
							playlistId,
						},
					});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/playlist]
	get(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);
		const { from, limit, status = '', search = '', ...rest } = req.query;

		try {
			const query = Helper.cleanObject(
				Helper.search(search, {
					status,
				}),
			);

			Playlist.find(query)
				.limit(limit)
				.skip(from)
				.sort(rest)
				.then((playlists) => {
					Playlist.countDocuments(query)
						.exec()
						.then((total) => {
							res.json({
								...Enum.response.success,
								data: {
									list: playlists.map((i) => ServicePlaylist.convertResponsePlaylist(i)),
									total,
								},
							});
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/playlist/details]
	details(req, res, next) {
		try {
			const { playlistId } = req.query;
			Playlist.findOne({ _id: playlistId })
				.then((singerItem) => {
					const dataResponse = ServicePlaylist.convertResponsePlaylist(singerItem);
					SongOfPlaylist.findOne({ playlistId }).then((dataPlaylist) => {
						const songs = dataPlaylist.songs.map(async (s) => {
							const singers = await SingerOfSong.findOne({ songId: s.songId }).then((dataSong) => {
								return dataSong.singers.map((singer) => ServicePlaylist.convertResponseArtist(singer));
							});
							return {
								...ServiceSong.convertResponseSong(s),
								songId: s.songId,
								singers,
							};
						});
						Promise.all(songs).then((data) => {
							res.json({
								...Enum.response.success,
								data: {
									...dataResponse,
									songs: data,
								},
							});
						});
					});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/playlist/me]
	me(req, res, next) {
		try {
			Playlist.find({ userId: req.user.userId })
				.then(async (playlist) => {
					const playListOfMe = await playlist.map(async (item) => {
						const dataResponse = ServicePlaylist.convertResponsePlaylistMe(item);
						const songsOfPlaylist = await SongOfPlaylist.findOne({ playlistId: item._id.toString() }).then((dataSongOfPlaylist) => {
							logger.debug('Controller me get dataSongOfPlaylist', dataSongOfPlaylist);
							const songs = dataSongOfPlaylist.songs.map(async (s) => {
								const singers = await SingerOfSong.findOne({ songId: s.songId }).then((dataSong) => {
									return dataSong.singers.map((singer) => ServicePlaylist.convertResponseArtist(singer));
								});
								return {
									...ServiceSong.convertResponseSongShort(s),
									songId: s.songId,
									singers,
								};
							});
							return Promise.all(songs);
						});
						return {
							...dataResponse,
							songs: songsOfPlaylist,
						};
					});
					Promise.all(playListOfMe).then((data) => {
						logger.debug('Controller me get data', data);
						res.json({
							...Enum.response.success,
							data: {
								list: data,
								total: data.length,
							},
						});
					});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/playlist/getRecent]
	getRecent(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);
		const { from, limit, search = '', ...rest } = req.query;

		try {
			Playlist.find({ status: Enum.playList.status.display })
				.limit(limit)
				.skip(from)
				.sort(rest)
				.then((playlists) => {
					Playlist.countDocuments(query)
						.exec()
						.then((total) => {
							res.json({
								...Enum.response.success,
								data: {
									list: playlists.map((i) => ServicePlaylist.convertResponsePlaylist(i)),
									total,
								},
							});
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/playlist/getFromUserWeb]
	getFromUserWeb(req, res, next) {
		logger.info('Controller getFromUserWeb execute upload image username');
		logger.debug('Controller getFromUserWeb get request from client', req.query);
		const { from, limit, status = Enum.playList.status.display, search = '', ...rest } = req.query;

		try {
			const query = Helper.cleanObject(
				Helper.search(search, {
					status,
				}),
			);

			Playlist.find(query)
				.limit(limit)
				.skip(from)
				.sort(rest)
				.then((playlists) => {
					Playlist.countDocuments(query)
						.exec()
						.then((total) => {
							res.json({
								...Enum.response.success,
								data: {
									list: playlists.map((i) => ServicePlaylist.convertResponsePlaylist(i)),
									total,
								},
							});
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[GET]-[/getFromUserWebDetails]
	getFromUserWebDetails(req, res, next) {
		try {
			const { playlistId } = req.query;
			logger.info('Controller getFromUserWebDetails execute');
			logger.debug('Controller getFromUserWebDetails get request from client', req.query);
			logger.debug('Controller getFromUserWebDetails get playlistId', playlistId);
			logger.debug('Controller getFromUserWebDetails get idUser', req.user);

			Playlist.findOne({ _id: playlistId })
				.then((playlist) => {
					const dataResponse = ServicePlaylist.convertResponsePlaylist(playlist);
					SongOfPlaylist.findOne({ playlistId }).then((dataPlaylist) => {
						const songs = dataPlaylist.songs.map(async (s) => {
							return await SongOfEachUser.findOne({ userId: req.user.userId })
								.then(async (sUser) => {
									const singers = await SingerOfSong.findOne({ songId: s.songId }).then((dataSong) => {
										return dataSong.singers.map((singer) => ServicePlaylist.convertResponseArtist(singer));
									});
									const response = {
										...ServiceSong.convertResponseSong(s),
										songId: s.songId,
										singers,
									};
									try {
										logger.debug('Controller getFromUserWebDetails get sUser', sUser);

										if (!sUser) {
											throw new Error('User not found');
										}
										const isSong = sUser.songsId.find((sU) => s.songId.toString() === sU.toString());
										if (!isSong) {
											throw new Error('User not found');
										}
										return {
											...response,
											isBelong: Enum.playList.songBelongUser.yes,
										};
									} catch (error) {
										return {
											...response,
											isBelong: Enum.playList.songBelongUser.no,
										};
									}
								})
								.catch((error) => {
									throw new Error(error);
								});
						});
						Promise.all(songs).then((data) => {
							logger.debug('Controller getFromUserWebDetails get data', data);
							res.json({
								...Enum.response.success,
								data: {
									...dataResponse,
									songs: data,
								},
							});
						});
					});
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/getFromUserWeb/addSongToPlaylist]
	addSongToPlaylistByUserWeb(req, res, next) {
		try {
			const { songId, playlistId } = req.body;
			logger.info('Controller addSongToPlaylistByUserWeb execute');
			logger.debug('Controller addSongToPlaylistByUserWeb get request from client', req.query);
			logger.debug('Controller addSongToPlaylistByUserWeb get songId', songId);
			logger.debug('Controller addSongToPlaylistByUserWeb get idUser', req.user);
			const payload = {
				userId: req.user.userId,
			};
			if (!playlistId) {
				payload.status = Enum.playList.status.liked;
			} else {
				payload.playlistId = playlistId;
			}
			logger.debug('Controller addSongToPlaylistByUserWeb get payload:', payload);

			Song.findOne({ _id: songId }).then((s) => {
				if (!s) {
					throw new Error('Song not found');
				}
				const songAfterFind = ServiceSong.convertResponseSong(s);
				logger.debug('Controller addSongToPlaylistByUserWeb get song', songAfterFind);

				SongOfEachUser.findOne({ userId: req.user.userId }).then((sUser) => {
					logger.debug('Controller addSongToPlaylistByUserWeb get song', sUser);
					if (!sUser) {
						const songOfEachUser = new SongOfEachUser({
							userId: req.user.userId,
							songsId: [songId],
						});
						songOfEachUser.save().then(() => {
							Playlist.findOneAndUpdate(payload, { songs: [songId] }).then((playlist) => {
								logger.debug('Controller addSongToPlaylistByUserWeb get playlist', playlist);
								if (!playlist) {
									throw new Error('Playlist not found');
								}
								SongOfPlaylist.findOneAndUpdate({ playlistId: playlist._id.toString() }, { $addToSet: { songs: songAfterFind } })
									.exec()
									.then((dataItem) => {
										logger.debug('Controller addSongToPlaylistByUserWeb get dataItem', dataItem);
										res.json({
											...Enum.response.success,
											mess: 'Add song to playlist successfully',
										});
									})
									.catch((error) => {
										throw new Error(error);
									});
							});
						});
					} else {
						const isSong = sUser.songsId.find((sU) => sU.toString() === songId.toString());
						if (!isSong) {
							Playlist.findOneAndUpdate(payload, { $push: { songs: songId } })
								.exec()
								.then((playlist) => {
									logger.debug('Controller addSongToPlaylistByUserWeb get playlist when user exists', playlist);
									if (!playlist) {
										throw new Error('Playlist not found');
									}
									SongOfPlaylist.findOneAndUpdate(
										{ playlistId: playlist._id.toString() },
										{ $push: { songs: songAfterFind } },
										{ new: true },
									)
										.exec()
										.then((dataItem) => {
											logger.debug('Controller addSongToPlaylistByUserWeb  when user exists get dataItem', dataItem);
											SongOfEachUser.findOneAndUpdate({ userId: req.user.userId }, { $addToSet: { songsId: songId } }).then(() => {
												res.json({
													...Enum.response.success,
													mess: 'Add song to playlist successfully',
												});
											});
										})
										.catch((error) => {
											throw new Error(error);
										});
								});
						}
					}
				});
			});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/getFromUserWeb/updateSongToPlaylist]
	updateSongToPlaylistByUserWeb(req, res, next) {
		try {
			const { songId, playlistIds } = req.body;
			logger.info('Controller updateSongToPlaylistByUserWeb execute');
			logger.debug('Controller updateSongToPlaylistByUserWeb get request from client', req.body);
			logger.debug('Controller updateSongToPlaylistByUserWeb get songId', songId);
			logger.debug('Controller updateSongToPlaylistByUserWeb get idUser', req.user);
			Song.findOne({ _id: songId }).then(async (s) => {
				if (!s) {
					throw new Error('Song not found');
				}
				const songAfterFind = ServiceSong.convertResponseSong(s);
				const playlists = await Playlist.find({ userId: req.user.userId });
				logger.debug('Controller updateSongToPlaylistByUserWeb get playlists', playlists);
				logger.debug('Controller updateSongToPlaylistByUserWeb get songAfterFind', songAfterFind);
				const bulkOps = ServicePlaylist.bulkOps(playlists, playlistIds, songId).filter(Boolean);
				logger.debug('Controller updateSongToPlaylistByUserWeb get bulkOps', JSON.stringify(bulkOps));

				async function bulkWriteFUnc() {
					await Playlist.bulkWrite(bulkOps).then(async () => {
						const bulkOfSongs = ServicePlaylist.bulkOpsForSongOfPlaylist(playlists, playlistIds, songId, songAfterFind).filter(Boolean);
						logger.debug('Controller updateSongToPlaylistByUserWeb get bulkOfSongs', JSON.stringify(bulkOfSongs));
						SongOfPlaylist.bulkWrite(bulkOfSongs).catch((error) => {
							throw new Error(error);
						});
					});
				}
				logger.debug('Controller updateSongToPlaylistByUserWeb getPlaylist', playlistIds.length);
				bulkWriteFUnc().then(() => {
					if (playlistIds.length > 0) {
						logger.info('Controller updateSongToPlaylistByUserWeb SongOfEachUser add:');
						SongOfEachUser.findOneAndUpdate({ userId: req.user.userId }, { $addToSet: { songsId: songId } }).then(async () => {
							res.json({
								...Enum.response.success,
								mess: 'Update song to playlist successfully',
								data: {},
							});
						});
					} else {
						logger.info('Controller updateSongToPlaylistByUserWeb SongOfEachUser remove all');
						SongOfEachUser.findOneAndUpdate({ userId: req.user.userId }, { $pull: { songsId: songId } }).then(async () => {
							res.json({
								...Enum.response.success,
								mess: 'Update song to playlist successfully',
								data: {},
							});
						});
					}
				});
			});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/getFromUserWeb/createByASong]
	createByASongPlaylistByUserWeb(req, res, next) {
		try {
			const { songId, descriptionPlaylist, image, namePlaylist } = req.body;
			logger.info('Controller createByASongPlaylistByUserWeb execute');
			logger.debug('Controller createByASongPlaylistByUserWeb get request from client', req.body);
			logger.debug('Controller createByASongPlaylistByUserWeb get songId', songId);
			logger.debug('Controller createByASongPlaylistByUserWeb get idUser', req.user);
			Song.findOne({ _id: songId }).then(async (s) => {
				if (!s) {
					throw new Error('Song not found');
				}
				const songAfterFind = ServiceSong.convertResponseSong(s);
				const playList = new Playlist({
					viewSaves: 0,
					userId: req.user.userId,
					songs: [songId],
					status: Enum.playList.status.user,
					descriptionPlaylist,
					image,
					theme: '#aa0909',
					namePlaylist,
				});
				playList.save().then((item) => {
					const songOfPlaylist = new SongOfPlaylist({
						playlistId: item._id,
						songs: [songAfterFind],
					});
					songOfPlaylist
						.save()
						.then(() => {
							SongOfEachUser.updateOne(
								{ userId: req.user.userId },
								{
									$addToSet: { songs: songId },
									$setOnInsert: { userId: req.user.userId, songsId: [songId] },
								},
								{ upsert: true }, // tự động tạo nêú không có
							).then(() => {
								res.json({
									...Enum.response.success,
									mess: 'Create playlist successful',
									data: {},
								});
							});
						})
						.catch((error) => {
							throw new Error(error);
						});
				});
			});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new PlaylistController();
