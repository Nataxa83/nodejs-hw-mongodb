import Joi from "joi";

import { regularExpEmail } from "../constants/auth.js";

export const authRegisterSchema = Joi.object({
    name: Joi.string().min(2).max(20).required().messages({
        'string.min': 'Invalid(name) number of characters. Minimum is 3.',
        'string.max': 'Invalid(name) number of characters. Maximum is 20.',
        'any.required': 'Name is required.',
    }),
    email: Joi.string().pattern(regularExpEmail).required().messages({
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'The password must be at least 6 characters long.',
      }),

});

export const authLoginSchema = Joi.object({
    email: Joi.string().pattern(regularExpEmail).required().messages({
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'The password must be at least 6 characters long.',
      }),

});
