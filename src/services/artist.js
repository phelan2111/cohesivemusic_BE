class ServiceArtist {
	convertResponseArtist(dataItem) {
		return {
			createdAt: dataItem.createdAt,
			updatedAt: dataItem.updatedAt,
			singerName: dataItem.singerName,
			singerAvatar: dataItem.singerAvatar,
			singerCover: dataItem.singerCover,
			singerDescription: dataItem.singerDescription,
			followers: dataItem.followers,
			contact: dataItem.contact,
			status: dataItem?.status,
			singerId: dataItem._id,
			socials: dataItem.socials,
		};
	}
}

module.exports = new ServiceArtist();
