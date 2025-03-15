const db = require('../config/db');

const folderController = {
    createFolder: async (req, res) => {
        try {
            const { userId, name } = req.body;
            console.log({ userId, name })

            const [result] = await db.execute('INSERT INTO folders (user_id, name) VALUES (?, ?)', [userId, name]);
            res.status(201).json({ message: 'Folder created successfully', folderId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create folder' });
        }
    },

    updateFolder: async (req, res) => {
        try {
            const folderId = req.params.id;
            const { name } = req.body;
            await db.execute('UPDATE folders SET name = ? WHERE id = ?', [name, folderId]);
            res.status(200).json({ message: 'Folder updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update folder' });
        }
    },

    deleteFolder: async (req, res) => {
        try {
            const folderId = req.params.id;
            await db.execute('DELETE FROM folders WHERE id = ?', [folderId]);
            res.status(200).json({ message: 'Folder deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete folder' });
        }
    },

    getAllFolders: async (req, res) => {
        try {
            const [folders] = await db.execute('SELECT * FROM folders');
            res.status(200).json({ data: folders });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch folders' });
        }
    },

    getFolderById: async (req, res) => {
        try {
            const folderId = req.params.id;
            const [folder] = await db.execute('SELECT * FROM folders WHERE id = ?', [folderId]);
            if (folder.length === 0) {
                return res.status(404).json({ message: 'Folder not found' });
            }
            res.status(200).json({ data: folder[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch folder' });
        }
    },

    getFoldersByUserId: async (req, res) => {
        console.log("đã vô")
        try {
            const userId = req.params.userId;
            console.log(userId)
            const [folders] = await db.execute('SELECT * FROM folders WHERE user_id = ?', [userId]);
            res.status(200).json({ data: folders });
            console.log({ data: folders })
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch folders by user ID' });
        }
    }
};

module.exports = folderController;
