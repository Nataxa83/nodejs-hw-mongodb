import {Router} from "express";

import * as contactsController from "../controllers/contacts.js";

import { ctrWrapper } from "../utils/ctrWrapper.js";
import { validateBody } from "../utils/validateBody.js";

import { isValidId } from "../middlewares/isValidId.js";

import { addContactSchema, updateContactSchema } from "../validation/contacts.js";


const contactsRouter = Router();

// contactsRouter.get("/", (req, res) => {
//     res.send("<h1>Hello World!</h1>" );
//   });

contactsRouter.get("/", ctrWrapper(contactsController.getContactsController));

contactsRouter.get("/:contactId", isValidId, ctrWrapper(contactsController.getContactByIdController));

contactsRouter.post("/", validateBody(addContactSchema),   ctrWrapper(contactsController.addContactController));

contactsRouter.put("/:contactId", isValidId, validateBody(addContactSchema), ctrWrapper(contactsController.upsertContactByIdController));

contactsRouter.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrWrapper(contactsController.patchContactByIdController));

contactsRouter.delete("/:contactId", isValidId, ctrWrapper(contactsController.deleteContactByIdController));

export default contactsRouter;
