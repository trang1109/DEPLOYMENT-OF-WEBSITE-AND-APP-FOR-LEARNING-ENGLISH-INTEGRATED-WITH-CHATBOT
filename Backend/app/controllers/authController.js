const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



function generateNewPassword() {
    // Độ dài của mật khẩu mới
    const length = 10;
    // Các ký tự có thể sử dụng để tạo mật khẩu
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newPassword = "";

    for (let i = 0; i < length; i++) {
        // Chọn một ký tự ngẫu nhiên từ charset và thêm vào mật khẩu mới
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return newPassword;
}


const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
            const [checkEmailExist] = await db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);

            if (checkEmailExist.length > 0) {
                return res.status(200).json('Email is exist');
            }

            // Thêm người dùng mới vào cơ sở dữ liệu
            const [rows] = await db.execute(
                'INSERT INTO users (username, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
                [req.body.username, req.body.email, hashed, req.body.phone, req.body.role, req.body.status]
            );

            const user = {
                id: rows.insertId,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };

            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json('Register fails');
        }
    },

    login: async (req, res) => {
        try {
            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
            const user = rows[0];

            if (!user) {
                return res.status(200).json({ message: 'Unregistered account!', status: false });
            }

            // So sánh mật khẩu
            const validatePassword = await bcrypt.compare(req.body.password, user.password);

            if (!validatePassword) {
                res.status(400).json({ message: 'Wrong password!', status: false });
            }

            if (user && validatePassword) {
                // Tạo mã thông báo JWT
                const token = jwt.sign({ user: user }, _const.JWT_ACCESS_KEY, { expiresIn: '30d' });

                res.header('Authorization', token);
                res.status(200).json({ user, token, status: true });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    
    forgotPassword: async (req, res) => {
        try {
            // Generate a new password
            const newPassword = generateNewPassword(); // Implement the function to generate a new password
    
            // Update the user's password in the database
            const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
            await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, req.body.email]);
    
            // Send the new password to the user's email
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'fScdnZ4WmEDqjBA1',
                },
            });
    
            const mailOptions = {
                from: 'coms@gmail.com',
                to: req.body.email,
                subject: 'New Password',
                text: `Your new password is: ${newPassword}`,
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Failed to send new password email!', status: false });
                }
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({ message: 'New password sent!', status: true });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    
    resetPassword: async (req, res) => {
        try {
            const token = req.body.token;

            // Tìm mã xác thực trong cơ sở dữ liệu
            const [tokenRows] = await db.execute('SELECT * FROM password_reset_tokens WHERE token = ?', [token]);
            const resetToken = tokenRows[0];

            if (!resetToken || resetToken.expires_at < new Date()) {
                return res.status(400).json({ message: 'Invalid or expired token!', status: false });
            }

            // Cập nhật mật khẩu cho người dùng
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

            await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, resetToken.user_id]);

            // Xóa mã xác thực đã sử dụng
            await db.execute('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

            res.status(200).json({ message: 'Password reset successful!', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
   
};

module.exports = authController;
