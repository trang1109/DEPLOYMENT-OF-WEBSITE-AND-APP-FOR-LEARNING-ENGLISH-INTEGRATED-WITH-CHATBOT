const db = require('../config/db');

const newsController = {
    createNews: async (req, res) => {
        try {
            const { name, description, image } = req.body; // Removed userId
            const [result] = await db.execute('INSERT INTO news (name, description, image) VALUES (?, ?, ?)', [name, description, image]); // Excluded userId from the query
            res.status(201).json({ message: 'News created successfully', newsId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create news' });
        }
    },

    updateNews: async (req, res) => {
        try {
            const { name, description, image } = req.body;
            const newsId = req.params.id;
            await db.execute('UPDATE news SET name = ?, description = ?, image = ? WHERE id = ?', [name, description, image, newsId]);
            res.status(200).json({ message: 'News updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update news' });
        }
    },
    
    deleteNews: async (req, res) => {
        try {
            const newsId = req.params.id;
            await db.execute('DELETE FROM news WHERE id = ?', [newsId]);
            res.status(200).json({ message: 'News deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete news' });
        }
    },

    getNewsById: async (req, res) => {
        try {
            const newsId = req.params.id;
            const [news] = await db.execute('SELECT * FROM news WHERE id = ?', [newsId]);
            if (news.length === 0) {
                return res.status(404).json({ message: 'News not found' });
            }
            res.status(200).json({ data: news[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch news' });
        }
    },

    getAllNews: async (req, res) => {
        try {
            const [news] = await db.execute('SELECT * FROM news');
            res.status(200).json({ data: news });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch news' });
        }
    },

    getNewsByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            const [news] = await db.execute('SELECT * FROM news WHERE user_id = ?', [userId]);
            res.status(200).json({ data: news });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch news by user ID' });
        }
    },

    searchNews: async (req, res) => {
        try {
            const { query } = req.query;
            const searchQuery = 'SELECT * FROM news WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${query}%`;
            const [news] = await db.execute(searchQuery, [searchTerm, searchTerm]);
            res.status(200).json({ data: news });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to search news' });
        }
    }
};

module.exports = newsController;
