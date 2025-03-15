const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const verifyToken = require('../utils/middleware');

router.post('/',topicController.createTopic);
router.put('/:id',topicController.updateTopic);
router.delete('/:id',topicController.deleteTopic);
router.get('/:id', topicController.getTopicById);
router.get('/', topicController.getAllTopics);
router.get('/user/:userId', topicController.getTopicsByUserId);

module.exports = router;
