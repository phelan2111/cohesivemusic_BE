const Playlist = require('../models/playlist-model');
const SongOfPlaylist = require('../models/songOfPlaylist-model');
const Song = require('../models/song-model');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');
const ServiceSong = require('../services/song');
const logger = require('../utils/logger');

class PlaylistController {
	//[PUT]-[/playlist]
	create(req, res, next) {
		const { singers, songs, ...rest } = req.body;

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
						logger.error(error);
						res.json({
							...Enum.response.systemError,
						});
					});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});

		const { id } = req.user;
	}

	//[POST]-[/playlist/uploadCover]
	uploadCover(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);

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
				logger.error(error);

				res.json({
					...Enum.response.systemError,
				});
			});
	}
}

module.exports = new PlaylistController();
