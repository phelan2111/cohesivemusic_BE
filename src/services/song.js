class ServiceSong {
	convertResponseSong(dataItem) {
		return {
			songName: dataItem.songName,
			image: dataItem.image,
			songDescription: dataItem.songDescription,
			link: dataItem.link,
			lyrics: dataItem.lyrics,
			views: dataItem.views,
			status: dataItem.status,
			songId: dataItem._id,
			createdAt: dataItem.createdAt,
			updatedAt: dataItem.updatedAt,
			type: dataItem?.type,
			duration: dataItem?.duration,
		};
	}
	convertResponseArtistShort(dataItem) {
		return {
			singerName: dataItem.singerName,
			singerId: dataItem._id,
		};
	}
	convertResponseSongShort(dataItem) {
		return {
			songName: dataItem.songName,
			image: dataItem.image,
			link: dataItem.link,
			songId: dataItem._id,
			type: dataItem?.type,
			duration: dataItem?.duration,
		};
	}
}

module.exports = new ServiceSong();
