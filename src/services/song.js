class ServiceSong {
	convertResponseSong(dataItem) {
		return {
			songName: dataItem.songName,
			image: dataItem.image,
			songDescription: dataItem.songDescription,
			link: dataItem.link,
			lyrics: dataItem.lyrics,
			typeSong: dataItem.typeSong,
			views: dataItem.views,
			status: dataItem.status,
			songId: dataItem._id,
			createdAt: dataItem.createdAt,
			updatedAt: dataItem.updatedAt,
		};
	}
}

module.exports = new ServiceSong();