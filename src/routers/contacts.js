import {Router} from "express";
import * as contactsController from "../controllers/contacts.js";

const contactsRouter = Router();

// contactsRouter.get("/", (req, res) => {
//     res.send("<h1>Hello World!</h1>" );
//   });

contactsRouter.get("/", contactsController.getContactsController);

contactsRouter.get("/:contactId", contactsController.getContactByIdController);

export default contactsRouter;
