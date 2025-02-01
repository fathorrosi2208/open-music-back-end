const Joi = require('joi');

const UserAlbumLikesPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  albumId: Joi.string().required(),
});

module.exports = { UserAlbumLikesPayloadSchema };
