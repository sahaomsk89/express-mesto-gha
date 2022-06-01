const router = require('express').Router();

const {
  getUsers,
  getUserById,
  findUserMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', findUserMe);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
