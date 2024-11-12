const express = require('express');
const router = express.Router();
const Song = require('../controllers/song-controller');
const SongValidator = require('../validators/song');
const CommonValidator = require('../validators/common');
const upload = require('../middleware/multer');

router.post('/uploadImage', upload.single('file'), Song.uploadImage);
router.post('/uploadMedia', upload.single('media'), Song.uploadMedia);
router.put('/', CommonValidator.isLoggedIn, SongValidator.hasFullValuesCreate, Song.create);
router.post('/', CommonValidator.isLoggedIn, SongValidator.hasFullValuesUpdate, Song.update);
router.get('/', CommonValidator.isLoggedIn, Song.get);
router.get('/details', CommonValidator.isLoggedIn, SongValidator.hasFullValuesDetails, Song.details);


module.exports = router;
