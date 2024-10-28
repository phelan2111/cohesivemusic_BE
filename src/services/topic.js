const Topic = require('../models/topic-model');
class ServiceTopic {
	getTopicDetailsByTopicId(topicId) {
		return Topic.findById(topicId);
	}
	convertResponseTopic(dataItem) {
		return {
			topicId: dataItem._id,
			topicName: dataItem.topicName,
			status: dataItem.status,
			createdAt: dataItem.createdAt,
			updatedAt: dataItem.updatedAt,
		};
	}
}

module.exports = new ServiceTopic();
