const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/genre-controller');
const GenreValidator = require('../validators/genre');
const CommonValidator = require('../validators/common');
const upload = require('../middleware/multer');

router.post('/uploadImage', upload.single('file'), GenreController.uploadImage);
router.put('/', CommonValidator.isLoggedIn, GenreValidator.hasFullValuesCreate, GenreController.create);
router.post('/', CommonValidator.isLoggedIn, GenreValidator.hasFullValuesUpdate, GenreController.update);
router.delete('/', CommonValidator.isLoggedIn, GenreValidator.hasFullValuesHidden, GenreController.updateStatus);
router.get('/', CommonValidator.isLoggedIn, GenreController.get);
router.get('/details', CommonValidator.isLoggedIn, GenreValidator.hasFullValuesGetDetails, GenreController.getDetails);
module.exports = router;
