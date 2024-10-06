const express = require('express');
const router = express.Router();
const BrowserController = require('../controllers/browse-controller');
const BrowserValidator = require('../validators/browse');
const CommonValidator = require('../validators/common');
const upload = require('../middleware/multer');

router.post('/uploadImage', upload.single('file'), BrowserController.uploadImage);
router.put('/', CommonValidator.isLoggedIn, BrowserValidator.hasFullValuesCreate, BrowserController.create);
router.post('/', CommonValidator.isLoggedIn, BrowserValidator.hasFullValuesUpdate, BrowserController.update);
router.delete('/', CommonValidator.isLoggedIn, BrowserValidator.hasFullValuesHidden, BrowserController.updateStatus);
router.get('/', CommonValidator.isLoggedIn, BrowserController.get);

module.exports = router;
