class Helper {
	isEmpty(dataItem) {
		if (dataItem && dataItem.length > 0) {
			return true;
		}
		return false;
	}
}

module.exports = new Helper();
