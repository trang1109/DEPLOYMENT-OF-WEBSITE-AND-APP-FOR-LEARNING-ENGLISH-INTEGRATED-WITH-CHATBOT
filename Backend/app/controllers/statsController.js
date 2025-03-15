const db = require('../config/db');

const statsController = {
    getStatistics: async (req, res) => {
        try {
            // Thống kê số thành viên
            const [totalMembers] = await db.execute('SELECT COUNT(*) AS totalMembers FROM users');

            // Thống kê số từ vựng
            const [totalVocabularies] = await db.execute('SELECT COUNT(*) AS totalVocabularies FROM vocabulary');

            // Thống kê số chủ đề
            const [totalTopics] = await db.execute('SELECT COUNT(*) AS totalTopics FROM categories');

            // Thống kê số học viên (role là "isClient")
            const [totalClients] = await db.execute('SELECT COUNT(*) AS totalClients FROM users WHERE role = "isClient"');

            // Tạo đối tượng chứa các thông số thống kê
            const statistics = {
                totalMembers: totalMembers[0].totalMembers,
                totalVocabularies: totalVocabularies[0].totalVocabularies,
                totalTopics: totalTopics[0].totalTopics,
                totalClients: totalClients[0].totalClients,
            };

            res.status(200).json(statistics);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = statsController;
