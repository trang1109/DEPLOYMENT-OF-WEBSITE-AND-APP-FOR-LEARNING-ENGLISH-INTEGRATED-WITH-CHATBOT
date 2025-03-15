const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const verifyToken = require('../utils/middleware');

router.put('/mark-important',wordController.markWordImportant);
router.put('/track-status',wordController.trackWordStatus);

router.post('/',wordController.addWordToTopic);
router.put('/:id',wordController.updateWordInTopic);
router.delete('/:id',wordController.deleteWordFromTopic);
router.get('/topic/:topicId', wordController.getAllWordsInTopic);
router.get('/:id', wordController.getWordById);
router.put('/unmark-important/:id',wordController.unMarkWordImportant); 


module.exports = router;
