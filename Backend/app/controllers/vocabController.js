// vocabController.js
const db = require('../config/db');

const vocabController = {
    // Tạo từ vựng mới
    createVocabulary: async (req, res) => {
        try {
            const { word, meaning, pronunciation, description, imageURL, audioURL, categoryIds } = req.body;

            // Kiểm tra xem từ vựng đã tồn tại chưa
            const [checkVocabExist] = await db.execute('SELECT * FROM vocabulary WHERE word = ?', [word]);

            if (checkVocabExist.length > 0) {
                return res.status(400).json({ message: 'Vocabulary already exists' });
            }

            // Tạo từ vựng mới
            const createQuery = `
                INSERT INTO vocabulary (word, meaning, pronunciation, description, imageURL, audioURL) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const values = [word, meaning, pronunciation, description, imageURL, audioURL];

            const [result] = await db.execute(createQuery, values);

            // Liên kết từ vựng với các danh mục
            if (categoryIds && categoryIds.length > 0) {
                const vocabId = result.insertId;
                const categoryLinks = categoryIds.map(categoryId => [vocabId, categoryId]);
                await db.query('INSERT INTO vocabulary_category (vocabulary_id, category_id) VALUES ?', [categoryLinks]);
            }

            res.status(201).json({ message: 'Vocabulary created successfully', vocabularyId: result.insertId });
        } catch (error) {
            console.error('Error creating vocabulary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Lấy thông tin từ vựng theo ID
    getVocabularyById: async (req, res) => {
        try {
            const vocabId = req.params.id;

            const [vocabulary] = await db.execute('SELECT * FROM vocabulary WHERE id = ?', [vocabId]);

            if (vocabulary.length === 0) {
                return res.status(404).json({ message: 'Vocabulary not found' });
            }

            // Lấy các danh mục liên kết với từ vựng này
            const [categories] = await db.execute(`
                SELECT c.* 
                FROM categories c 
                JOIN vocabulary_category vc ON c.id = vc.category_id 
                WHERE vc.vocabulary_id = ?
            `, [vocabId]);

            res.status(200).json({ vocabulary: vocabulary[0], categories });
        } catch (error) {
            console.error('Error getting vocabulary by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Cập nhật thông tin từ vựng
    updateVocabulary: async (req, res) => {
        console.log("đ")
        try {
            const vocabId = req.params.id;
            const { word, meaning, pronunciation, description, imageURL, audioURL, categoryIds } = req.body;

            // Kiểm tra xem từ vựng có tồn tại không
            const [checkVocabExist] = await db.execute('SELECT * FROM vocabulary WHERE id = ?', [vocabId]);
            if (checkVocabExist.length === 0) {
                return res.status(404).json({ message: 'Vocabulary not found' });
            }

            // Tạo đối tượng để lưu các cặp { trường: giá trị } cần cập nhật
            const updateFields = {};
            if (word) updateFields.word = word;
            if (meaning) updateFields.meaning = meaning;
            if (pronunciation) updateFields.pronunciation = pronunciation;
            if (description) updateFields.description = description;
            if (imageURL) updateFields.imageURL = imageURL;
            if (audioURL) updateFields.audioURL = audioURL;

            // Xây dựng truy vấn SQL và giá trị cho các trường cần cập nhật
            if (Object.keys(updateFields).length > 0) {
                let updateQuery = 'UPDATE vocabulary SET';
                const updateValues = [];
                Object.keys(updateFields).forEach((field, index) => {
                    updateQuery += ` ${field} = ?`;
                    if (index < Object.keys(updateFields).length - 1) updateQuery += ',';
                    updateValues.push(updateFields[field]);
                });
                updateQuery += ' WHERE id = ?';
                updateValues.push(vocabId);

                // Thực hiện cập nhật từ vựng
                const [result] = await db.execute(updateQuery, updateValues);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Vocabulary not found' });
                }
            }

            // Cập nhật liên kết với các danh mục (nếu có)
            if (categoryIds && Array.isArray(categoryIds)) {
                // Xóa các liên kết hiện có
                await db.execute('DELETE FROM vocabulary_category WHERE vocabulary_id = ?', [vocabId]);

                // Thêm các liên kết mới
                if (categoryIds.length > 0) {
                    const categoryLinks = categoryIds.map(categoryId => [vocabId, categoryId]);
                    await db.query('INSERT INTO vocabulary_category (vocabulary_id, category_id) VALUES ?', [categoryLinks]);
                }
            }

            res.status(200).json({ message: 'Vocabulary updated successfully' });
        } catch (error) {
            console.error('Error updating vocabulary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    // Xóa từ vựng
    deleteVocabulary: async (req, res) => {
        try {
            const vocabId = req.params.id;

            // Xóa liên kết với danh mục trước
            await db.execute('DELETE FROM vocabulary_category WHERE vocabulary_id = ?', [vocabId]);

            // Xóa từ vựng
            const [result] = await db.execute('DELETE FROM vocabulary WHERE id = ?', [vocabId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Vocabulary not found' });
            }

            res.status(200).json({ message: 'Vocabulary deleted successfully' });
        } catch (error) {
            console.error('Error deleting vocabulary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Tìm kiếm từ vựng theo từ khóa
    searchVocabularyByWord: async (req, res) => {
        try {
            const { word } = req.query;

            // Tạo câu truy vấn SQL để tìm kiếm từ vựng theo từ khóa
            const searchQuery = 'SELECT * FROM vocabulary WHERE word LIKE ?';
            const searchTerm = `%${word}%`;

            // Thực hiện truy vấn tìm kiếm vào cơ sở dữ liệu
            const [vocabularies] = await db.execute(searchQuery, [searchTerm]);

            res.status(200).json({ vocabularies });
        } catch (error) {
            console.error('Error searching vocabulary by word:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Lấy danh sách tất cả từ vựng
    getAllVocabularies: async (req, res) => {
        try {
            // Truy vấn để lấy tất cả từ vựng
            const vocabularyQuery = 'SELECT * FROM vocabulary';
            const [vocabularies] = await db.execute(vocabularyQuery);

            // Truy vấn để lấy các danh mục liên kết với từng từ vựng
            const categoriesQuery = `
                SELECT vc.vocabulary_id, c.*
                FROM categories c
                JOIN vocabulary_category vc ON c.id = vc.category_id
            `;
            const [categories] = await db.execute(categoriesQuery);

            // Tạo một đối tượng để nhóm các danh mục theo từ vựng
            const categoriesByVocabulary = {};
            categories.forEach(category => {
                const vocabId = category.vocabulary_id;
                if (!categoriesByVocabulary[vocabId]) {
                    categoriesByVocabulary[vocabId] = [];
                }
                categoriesByVocabulary[vocabId].push({
                    id: category.id,
                    name: category.name,
                    description: category.description
                });
            });

            // Kết hợp danh mục với mỗi từ vựng
            const vocabulariesWithCategories = vocabularies.map(vocab => ({
                ...vocab,
                categories: categoriesByVocabulary[vocab.id] || []
            }));

            res.status(200).json({ vocabularies: vocabulariesWithCategories });
        } catch (error) {
            console.error('Error getting all vocabularies:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Lấy từ vựng theo danh mục
    getVocabulariesByCategory: async (req, res) => {
        try {
            const categoryId = req.params.categoryId;

            // Truy vấn để lấy từ vựng theo danh mục
            const query = `
                SELECT v.* 
                FROM vocabulary v
                JOIN vocabulary_category vc ON v.id = vc.vocabulary_id
                WHERE vc.category_id = ?
            `;

            const [vocabularies] = await db.execute(query, [categoryId]);

            res.status(200).json({ vocabularies });
        } catch (error) {
            console.error('Error getting vocabularies by category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = vocabController;
