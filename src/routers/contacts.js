import {Router} from "express";
import * as contactsServices from "../services/contacts-services.js";

const contactsRouter = Router();

// contactsRouter.get("/", (req, res) => {
//     res.send("<h1>Hello World!</h1>" );
//   });

contactsRouter.get("/", async(req, res) => {
    const contacts = await contactsServices.getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

contactsRouter.get("/:contactId", async(req, res) => {
    const {contactId} = req.params;
    const data = await contactsServices.getContactById(contactId);

    if (!data) {
      res.status(404).json({
        status: 404,
        message: `Contact with id ${contactId} not found`,
      });
      return;
    };
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
  });
  });

  export default contactsRouter;
