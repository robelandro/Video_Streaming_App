import Joi from "joi";
import { RequestHandler } from "express";
import AppError from "./apperror";

const validate = (joiSchema: Joi.Schema, target: 'body' | 'headers' | 'query' | 'params'): RequestHandler => {
  return (req, res, next) => {
    const validationTarget = req[target];

    // Validate incoming request part
    const { value, error } = joiSchema.validate(validationTarget);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    // Add "value" on request object
    req.value = value;
    next();
  };
};

export const bodyValidator = (joiSchema: Joi.Schema): RequestHandler => {
  return validate(joiSchema, 'body');
};

export const headerValidator = (joiSchema: Joi.Schema): RequestHandler => {
  return validate(joiSchema, 'headers');
};

export const queryValidator = (joiSchema: Joi.Schema): RequestHandler => {
  return validate(joiSchema, 'query');
};

export const paramValidator = (joiSchema: Joi.Schema): RequestHandler => {
  return validate(joiSchema, 'params');
};
