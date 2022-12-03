const userRouter = require('express').Router();
const userController = require('../controllers/usersControllers');
const { validateUserInfo } = require('../utils/validators/userValidators');

userRouter.get('/me', userController.getProfile);
userRouter.patch('/me', validateUserInfo, userController.updateUserInfo);

module.exports = userRouter;
