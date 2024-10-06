const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Attribute = require('../models/attribute-model ');

class AttributeController {
	//[PUT]-[/attribute]
	create(req, res, next) {
		const dataBody = req.body;
		const attribute = new Attribute({
			...dataBody,
			status: Enum.attribute.status.display,
		});
		attribute
			.save()
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[GET]-[/attribute]
	get(req, res, next) {
		Attribute.find({ status: Enum.attribute.status.display })
			.then((attributes) => {
				res.json({
					...Enum.response.success,
					data: {
						list: attributes,
						total: attributes.length,
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

	//[POST]-[/browse]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Attribute.findByIdAndUpdate(id, rest)
			.then((browseItem) => {
				res.json({
					...Enum.response.success,
					data: {
						id: browseItem._id.toString(),
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

	//[DELETE]-[/browse]
	updateStatus(req, res, next) {
		const { id, status } = req.body;

		Attribute.findByIdAndUpdate(id, { status })
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/browse/uploadImage]
	uploadImage(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'attribute/image',
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

module.exports = new AttributeController();
