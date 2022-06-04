const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Требуется авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
