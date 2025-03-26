const Playlist = require('../models/playlist-model');
const SongOfPlaylist = require('../models/songOfPlaylist-model');
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
					Playlist.findOneAndUpdate(playlistId, rest)
						.then(() => {
							SongOfPlaylist.findOneAndUpdate(playlistId, { songs: convertSong })
								.then(() => {
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
		const { playlistId } = req.body;

		try {
			Playlist.findOneAndUpdate({ _id: playlistId })
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
}

module.exports = new PlaylistController();
