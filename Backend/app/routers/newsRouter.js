const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');


router.get('/search', newsController.searchNews);
router.put('/:id', newsController.updateNews);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.createNews);
router.delete('/:id', newsController.deleteNews);
router.get('/category/:category_id', newsController.getNewsByUserId); 

module.exports = router;
