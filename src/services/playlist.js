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
}

module.exports = new ServicePlaylist();
