import {Router} from "express";
import * as contactsController from "../controllers/contacts.js";
import { ctrWrapper } from "../utils/ctrWrapper.js";

const contactsRouter = Router();

// contactsRouter.get("/", (req, res) => {
//     res.send("<h1>Hello World!</h1>" );
//   });

contactsRouter.get("/", ctrWrapper(contactsController.getContactsController));

contactsRouter.get("/:contactId", ctrWrapper(contactsController.getContactByIdController));

export default contactsRouter;
