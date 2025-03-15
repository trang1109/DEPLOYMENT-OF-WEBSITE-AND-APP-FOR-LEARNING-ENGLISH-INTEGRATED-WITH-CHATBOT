const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const verifyToken = require('../utils/middleware');

router.post('/',folderController.createFolder);
router.put('/:id',folderController.updateFolder);
router.delete('/:id',folderController.deleteFolder);
router.get('/', folderController.getAllFolders);
router.get('/:id', folderController.getFolderById);
router.get('/user/:userId', folderController.getFoldersByUserId);

module.exports = router;
