const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); 
const app = express();
const _CONST = require('./app/config/constant')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

require('./app/models/createTables');

// Thay đổi kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'englishmentor'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

const authRoute = require('./app/routers/auth');
const userRoute = require('./app/routers/user');
const folderRoute = require('./app/routers/folder');
const topicRoute = require('./app/routers/topic');
const wordRoute = require('./app/routers/word');
const categoryRoute = require('./app/routers/category');
const vocabRoute = require('./app/routers/vocab');
const statsRoute = require('./app/routers/stats');
const notificationRoutes = require('./app/routers/notification');
const newsRouter = require('./app/routers/newsRouter');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/folder', folderRoute);
app.use('/api/topic', topicRoute);
app.use('/api/word', wordRoute);
app.use('/api/category', categoryRoute);
app.use('/api/vocabulary', vocabRoute);
app.use('/api/stats', statsRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/news', newsRouter);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
