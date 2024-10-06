const express = require('express');
const router = express.Router();
const Attribute = require('../controllers/attribute-controller');
const AttributeValidator = require('../validators/attribute');
const CommonValidator = require('../validators/common');
const upload = require('../middleware/multer');

router.post('/uploadImage', upload.single('file'), Attribute.uploadImage);
router.put('/', CommonValidator.isLoggedIn, AttributeValidator.hasFullValuesCreate, Attribute.create);
router.post('/', CommonValidator.isLoggedIn, AttributeValidator.hasFullValuesUpdate, Attribute.update);
router.delete('/', CommonValidator.isLoggedIn, AttributeValidator.hasFullValuesHidden, Attribute.updateStatus);
router.get('/', CommonValidator.isLoggedIn, Attribute.get);

module.exports = router;
