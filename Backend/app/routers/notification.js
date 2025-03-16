const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); 

router.get('/', notificationController.getAllNotifications);

// Endpoint để tạo thông báo
router.post('/', notificationController.createNotification);

router.post('/createNotificationByEmail', notificationController.createNotificationByEmail);

// Endpoint để lấy thông báo dựa trên vai trò
router.get('/:role', notificationController.getNotificationsByRole);

module.exports = router;
