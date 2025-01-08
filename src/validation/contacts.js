import Joi from "joi";
import { typeList } from "../constants/contacts.js";

const min = 3;
const max = 20;

export const addContactSchema = Joi.object({
    name: Joi.string().required().min(min).max(max).messages({
        "string.min": `Name should be at least ${min} characters long`,
        "string.max": `Name should be at most ${max} characters long`,
        "any.required": `Name is required`,
    }),
    phoneNumber: Joi.string().required().min(min).max(max).messages({
        "string.min": `Phone number should be at least ${min} characters long`,
        "string.max": `Phone number should be at most ${max} characters long`,
        "any.required": `Phone number is required`,
    }),
    email: Joi.string().min(3).max(20).email(
        {minDomainSegments: 2,
            tlds: {allow: ['com', 'net', 'ua'],
            deny: ['ru', 'su', 'rf', 'рф' ]
            }},
    ).messages({
        "string.min": `Email should be at least ${min} characters long`,
        "string.max": `Email should be at most ${max} characters long`,

    }),
    isFavorite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList).required().messages({
        "any.required": `Contact type is required`,
    }),
});
