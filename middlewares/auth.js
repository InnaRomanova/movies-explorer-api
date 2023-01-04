const jwt = require('jsonwebtoken');
const { getJWTSecretKey } = require('../utils/utils');
const UnauthorixedErrorCode = require('../errors/unauthorixedErrorCode');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorixedErrorCode('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  // верифицирую токен
  try {
    payload = jwt.verify(token, getJWTSecretKey());
  } catch (err) {
    return next(new UnauthorixedErrorCode('Необходима авторизация'));
  // отправляю ошибку, если не получилось
  }
  // записываю пейлоуд в объект запроса
  req.user = payload;
  // пропускаю запрос дальше
  return next();
};
