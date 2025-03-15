// vocabRoutes.js
const express = require('express');
const router = express.Router();
const vocabController = require('../controllers/vocabController');

// Lấy từ vựng theo danh mục
router.get('/by-category/:categoryId', vocabController.getVocabulariesByCategory);

// Tìm kiếm từ vựng theo từ khóa
router.get('/search', vocabController.searchVocabularyByWord);

// Tạo từ vựng mới
router.post('/', vocabController.createVocabulary);
// Cập nhật thông tin từ vựng
router.put('/:id', vocabController.updateVocabulary);

// Lấy thông tin từ vựng theo ID
router.get('/:id', vocabController.getVocabularyById);

// Xóa từ vựng
router.delete('/:id', vocabController.deleteVocabulary);

// Lấy danh sách tất cả từ vựng
router.get('/', vocabController.getAllVocabularies);

module.exports = router;
