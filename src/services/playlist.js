class ServicePlaylist {
	convertResponsePlaylist(dataItem) {
		return {
			playlistId: dataItem._id,
			namePlaylist: dataItem.namePlaylist,
			descriptionPlaylist: dataItem.descriptionPlaylist,
			image: dataItem.image,
			userId: dataItem.userId,
			updatedAt: dataItem.updatedAt,
			createdAt: dataItem.createdAt,
			songs: dataItem.songs,
			viewSaves: dataItem.viewSaves,
			status: dataItem.status,
			theme: dataItem.theme,
		};
	}
	convertResponseArtist(dataItem) {
		return {
			singerName: dataItem.singerName,
			singerAvatar: dataItem.singerAvatar,
			singerId: dataItem._id,
			status: dataItem?.status,
			followers: dataItem.followers,
		};
	}
	convertResponsePlaylistMe(dataItem) {
		return {
			playlistId: dataItem._id,
			namePlaylist: dataItem.namePlaylist,
			image: dataItem.image,
			userId: dataItem.userId,
			songs: dataItem.songs,
			viewSaves: dataItem.viewSaves,
			status: dataItem.status,
			theme: dataItem.theme,
		};
	}
	bulkOps(playlists, playlistIds, songId, item) {
		const bulkOps = playlists.map((playlist) => {
			const shouldHave = playlistIds.includes(playlist._id.toString());
			const alreadyHas = playlist.songs.includes(songId);

			if (shouldHave && !alreadyHas) {
				return {
					updateOne: {
						filter: { _id: playlist._id },
						update: { $addToSet: { songs: item } },
					},
				};
			}

			if (!shouldHave && alreadyHas) {
				return {
					updateOne: {
						filter: { _id: playlist._id },
						update: { $pull: { songs: item } },
					},
				};
			}

			return null;
		});
		return bulkOps;
	}
	bulkOpsForSongOfPlaylist(playlists, playlistIds, songId, item) {
		const bulkOps = playlists.map((playlist) => {
			const shouldHave = playlistIds.includes(playlist._id.toString());
			const alreadyHas = playlist.songs.includes(songId);

			if (shouldHave && !alreadyHas) {
				return {
					updateOne: {
						filter: { playlistId: playlist._id },
						update: { $addToSet: { songs: item } },
					},
				};
			}

			if (!shouldHave && alreadyHas) {
				return {
					updateOne: {
						filter: { playlistId: playlist._id },
						update: { $pull: { songs: { songId: item?.songId } } },
					},
				};
			}

			return null;
		});
		return bulkOps;
	}
}

module.exports = new ServicePlaylist();
