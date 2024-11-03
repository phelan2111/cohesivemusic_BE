class ServiceGenre {
	convertResponseGenre(dataItem) {
		return {
			genreId: dataItem.genreId,
			nameGenre: dataItem.nameGenre,
			imageGenre: dataItem.imageGenre,
			status: dataItem.status,
			createdAt: dataItem.createdAt,
			updatedAt: dataItem.updatedAt,
		};
	}
}

module.exports = new ServiceGenre();
