const db = require('../config/db');

const topicController = {
    createTopic: async (req, res) => {
        try {
            const { userId, topicName, description, folderId } = req.body;
            const [result] = await db.execute('INSERT INTO topics (user_id, name, description, folder_id) VALUES (?, ?, ?, ?)', [userId, topicName, description, folderId]);
            res.status(201).json({ message: 'Topic created successfully', topicId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create topic' });
        }
    },

    updateTopic: async (req, res) => {
        try {
            const { topicName, description, folderId } = req.body;
            const topicId = req.params.id;
            await db.execute('UPDATE topics SET name = ?, description = ?, folder_id = ? WHERE id = ?', [topicName, description, folderId, topicId]);
            res.status(200).json({ message: 'Topic updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update topic' });
        }
    },
    
    deleteTopic: async (req, res) => {
        try {
            const topicId = req.params.id;
            await db.execute('DELETE FROM topics WHERE id = ?', [topicId]);
            res.status(200).json({ message: 'Topic deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete topic' });
        }
    },

    getTopicById: async (req, res) => {
        try {
            const topicId = req.params.id;
            const [topic] = await db.execute('SELECT * FROM topics WHERE id = ?', [topicId]);
            if (topic.length === 0) {
                return res.status(404).json({ message: 'Topic not found' });
            }
            res.status(200).json({ data: topic[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch topic' });
        }
    },

    getAllTopics: async (req, res) => {
        try {
            const [topics] = await db.execute('SELECT * FROM topics');
            res.status(200).json({ data: topics });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch topics' });
        }
    },

    getTopicsByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            console.log(userId);
            const [topics] = await db.execute('SELECT * FROM topics WHERE user_id = ?', [userId]);
            res.status(200).json({ data: topics });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch topics by user ID' });
        }
    }
};

module.exports = topicController;
