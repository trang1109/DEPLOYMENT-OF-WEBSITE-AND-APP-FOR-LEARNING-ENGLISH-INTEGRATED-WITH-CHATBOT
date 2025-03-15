const db = require('../config/db');

const wordController = {
    addWordToTopic: async (req, res) => {
        try {
            const { topicId, word, definition } = req.body;
            const [result] = await db.execute('INSERT INTO words (topic_id, word, definition) VALUES (?, ?, ?)', [topicId, word, definition]);
            res.status(201).json({ message: 'Word added to topic successfully', wordId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to add word to topic' });
        }
    },

    deleteWordFromTopic: async (req, res) => {
        try {
            const wordId = req.params.id;
            await db.execute('DELETE FROM words WHERE id = ?', [wordId]);
            res.status(200).json({ message: 'Word deleted from topic successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete word from topic' });
        }
    },

    updateWordInTopic: async (req, res) => {
        try {
            const { word, definition } = req.body;
            const wordId = req.params.id;
            await db.execute('UPDATE words SET word = ?, definition = ? WHERE id = ?', [word, definition, wordId]);
            res.status(200).json({ message: 'Word updated in topic successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update word in topic' });
        }
    },

    getAllWordsInTopic: async (req, res) => {
        try {
            const topicId = req.params.topicId;
            const [words] = await db.execute('SELECT * FROM words WHERE topic_id = ?', [topicId]);
            res.status(200).json({ data: words });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch words in topic' });
        }
    },

    getWordById: async (req, res) => {
        try {
            const wordId = req.params.id;
            const [word] = await db.execute('SELECT * FROM words WHERE id = ?', [wordId]);
            if (word.length === 0) {
                return res.status(404).json({ message: 'Word not found' });
            }
            res.status(200).json({ data: word[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch word' });
        }
    },

    trackWordStatus: async (req, res) => {
        try {
            const { wordId, status } = req.body;
            console.log(wordId, status )

            await db.execute('UPDATE words SET status = ? WHERE id = ?', [status, wordId]);
            res.status(200).json({ message: 'Word status updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update word status' });
        }
    },

    markWordImportant: async (req, res) => {
        try {
            const { wordId, isImportant } = req.body;
            await db.execute('UPDATE words SET is_important = ? WHERE id = ?', [isImportant, wordId]);
            res.status(200).json({ message: 'Word marked as important successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to mark word as important' });
        }
    },

    unMarkWordImportant: async (req, res) => {
        try {
            const wordId = req.params.id;
            await db.execute('UPDATE words SET is_important = 0 WHERE id = ?', [wordId]);
            res.status(200).json({ message: 'Word unmarked as important successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to unmark word as important' });
        }
    },
};

module.exports = wordController;
