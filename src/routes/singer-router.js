const express = require('express');
const router = express.Router();
const Singer = require('../controllers/singer-controller');
const SingerValidator = require('../validators/singer');
const CommonValidator = require('../validators/common');
const upload = require('../middleware/multer');

router.post('/uploadAvatar', upload.single('avatar'), Singer.uploadAvatar);
router.post('/uploadCovers', upload.array('covers', 4), Singer.uploadCovers);
router.put('/', CommonValidator.isLoggedIn, SingerValidator.hasFullValuesCreate, Singer.create);
router.post('/', CommonValidator.isLoggedIn, SingerValidator.hasFullValuesUpdate, Singer.update);
router.delete('/', CommonValidator.isLoggedIn, SingerValidator.hasFullValuesUpdate, Singer.updateStatus);
router.get('/', CommonValidator.isLoggedIn, Singer.get);

module.exports = router;
