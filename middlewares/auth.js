const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload; // записываем пейлоуд в объект запроса

    next();
  } catch (err) {
    return handleAuthError(res);
  } // пропускаем запрос дальше
};
