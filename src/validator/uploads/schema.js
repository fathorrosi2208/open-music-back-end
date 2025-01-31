const Joi = require('joi');

const MAX_FILE_SIZE = 512000;

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
    )
    .required(),
  'content-length': Joi.number()
    .max(MAX_FILE_SIZE)
    .required()
    .messages({
      'number.max': `File size should be less than ${MAX_FILE_SIZE / 1024}KB`,
    }),
}).unknown();

module.exports = { ImageHeadersSchema };
