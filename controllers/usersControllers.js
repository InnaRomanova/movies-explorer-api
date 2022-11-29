const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCode = require('../errors/errorCode');
const NotFoundCode = require('../errors/notFoundCode');
const ConflictEmail = require('../errors/conflictEmail');
const { getJWTSecretKey } = require('../utils/utils');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      // создаю токен
      const token = jwt.sign({ _id: user._id }, getJWTSecretKey(), { expiresIn: '7d' });
      res
        .cookie('token', token, {
          // JWT токен, который отправляем
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
          secure: true,
          domain: 'api.romanova.nomoredomains.club',
        }).send({ email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли из профиля' });
};

module.exports.getUsers = (req, res, next) => {
  User.find({}).then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        throw new NotFoundCode('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректный id формат пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    res.status(201).send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictEmail('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new ErrorCode('Ошибка валидации'));
    } else {
      next(err);
    }
  }
};

const updateUser = (req, res, next, userData) => {
  User.findByIdAndUpdate(req.user._id, userData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode('Отправленные данные некорректный, перепроверьте данные.'));
      } else if (err.name === 'CastError') {
        next(new ErrorCode('Не корректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userData = {
    name: req.body.name,
  };
  updateUser(req, res, next, userData);
};

module.exports.getProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};
