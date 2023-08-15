import Joi from "joi";

export const userFiledVaildation = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required()
});
