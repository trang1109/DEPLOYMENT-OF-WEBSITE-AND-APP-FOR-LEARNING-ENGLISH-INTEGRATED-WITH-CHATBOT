const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                status VARCHAR(255) DEFAULT 'noactive',
                image VARCHAR(255) DEFAULT 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "users" created or already exists.');

        // Tạo bảng "news" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "news" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');


        await db.execute(`
    CREATE TABLE IF NOT EXISTS folders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);
        console.log('Table "folders" created or already exists.');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS topics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                folder_id INT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (folder_id) REFERENCES folders(id)
            )
        `);
        console.log('Table "topics" created or already exists.');


        await db.execute(`
        CREATE TABLE IF NOT EXISTS words (
            id INT AUTO_INCREMENT PRIMARY KEY,
            topic_id INT NOT NULL,
            word VARCHAR(255) NOT NULL,
            definition TEXT,
            is_important BOOLEAN DEFAULT false,
            status ENUM('not_learned', 'learning', 'learned') DEFAULT 'not_learned', 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )
    `);
    console.log('Table "words" created or already exists.');
    
   // Tạo bảng "categories" nếu chưa tồn tại
   await db.execute(`
   CREATE TABLE IF NOT EXISTS categories (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) UNIQUE NOT NULL,
       description TEXT,
       image VARCHAR(255),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )
   `);

    console.log('Table "categories" created or already exists.');

     // Tạo bảng "vocabulary" nếu chưa tồn tại
     await db.execute(`
     CREATE TABLE IF NOT EXISTS vocabulary (
         id INT AUTO_INCREMENT PRIMARY KEY,
         word VARCHAR(255) NOT NULL,
         meaning TEXT NOT NULL,
         pronunciation VARCHAR(255),
         description TEXT,
         imageURL VARCHAR(255),
         audioURL VARCHAR(255),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     )
    `);

    console.log('Table "vocabulary" created or already exists.');

    // Tạo bảng liên kết "vocabulary_category" nếu chưa tồn tại
    await db.execute(`
        CREATE TABLE IF NOT EXISTS vocabulary_category (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vocabulary_id INT NOT NULL,
            category_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id),
            FOREIGN KEY (category_id) REFERENCES categories(id),
            UNIQUE (vocabulary_id, category_id) -- Đảm bảo rằng mỗi cặp vocabulary và category là duy nhất
        )
    `);

    console.log('Table "vocabulary_category" created or already exists.');


    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
