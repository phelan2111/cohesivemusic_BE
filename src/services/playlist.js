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
		};
	}
}

module.exports = new ServicePlaylist();
