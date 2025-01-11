import { isValidObjectId } from "mongoose";
import  createError  from "http-errors";

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    console.log(contactId);
    if (!isValidObjectId(contactId)) {
        return next(createError(400, `${contactId} is not a valid id`));
    }
  next();
};
