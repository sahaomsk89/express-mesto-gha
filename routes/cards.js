const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCards,
  deleteCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(29),
    link: Joi.string().required().regex(/^(http(s)?:\/\/)(?:www\.|(?!www))+[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),

}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
