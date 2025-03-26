const express = require('express');
const router = express.Router();
const CommonValidator = require('../validators/common');
const PlaylistController = require('../controllers/playlist-controller');
const PlaylistValidators = require('../validators/playlist');
const upload = require('../middleware/multer');

router.post('/uploadCover', upload.single('file'), PlaylistController.uploadCover);
router.delete('/', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesUpdateStatus, PlaylistController.updateStatus);
router.post('/', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesUpdate, PlaylistController.update);
router.put('/', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesCreate, PlaylistController.create);
router.get('/', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesGet, PlaylistController.get);
router.get('/details', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesDetails, PlaylistController.details);

module.exports = router;
