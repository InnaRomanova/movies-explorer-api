const router = require('express').Router();
const userController = require('../controllers/usersControllers');
const { validateLoginData, validateRegisterData } = require('../utils/validators/userValidators');
const moviesRoute = require('./moviesRoute');
const usersRoute = require('./usersRoute');
const auth = require('../middlewares/auth');
const NotFoundCode = require('../errors/notFoundCode');

// крашт-тест
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// авторизация
router.post('/signin', validateLoginData, userController.login);
// регистрация
router.post('/signup', validateRegisterData, userController.createUser);

router.use(auth);
// защищенные роуты
router.use('/users', usersRoute);
router.use('/movies', moviesRoute);
router.get('/signout', userController.logout);
router.use(() => {
  throw new NotFoundCode('Ресурс не найден. Проверьте адрес');
});

module.exports = router;
