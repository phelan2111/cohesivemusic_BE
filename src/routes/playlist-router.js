const express = require('express');
const router = express.Router();
const CommonValidator = require('../validators/common');
const PlaylistController = require('../controllers/playlist-controller');
const PlaylistValidators = require('../validators/playlist');
const upload = require('../middleware/multer');

router.post('/uploadCover', upload.single('file'), PlaylistController.uploadCover);
router.put('/', CommonValidator.isLoggedIn, PlaylistValidators.hasFullValuesCreate, PlaylistController.create);

module.exports = router;
