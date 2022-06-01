const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    if (req.user._id === card.owner.toString()) {
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ data: card });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'id неверен' });
            return;
          }
          res.status(500).send({ message: 'Произошла ошибка' });
        });
      return;
    }
    res.status(403).send({ message: 'Невозможно удалить карту других пользователей' });
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'id неверен' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'id неверен' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'id не верен' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
