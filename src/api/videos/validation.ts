import Joi from "joi";

export const videoHeaderVaildation = Joi.object({
  'content-name': Joi.string().required(),
  'content-type': Joi.string().required(),
  'content-length': Joi.string().required(),
}).unknown();

export const videoQureyValidation = Joi.object({
  page: Joi.number(),
});

export const videoIdValidation = Joi.object({
  id: Joi.string().required(),
});
