const userController = require("../controllers/userController");
const router = require("express").Router();
const verifyToken = require('../utils/middleware');

router.get("/searchByEmail", userController.searchUserByEmail);
router.post('/search', userController.getAllUsers);
router.get('/profile', userController.getProfile);
router.put('/updateProfile/:id', userController.updateProfile);
router.put('/changePassword/:id', userController.changePassword);

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;