import * as contactsServices from "../services/contacts-services.js";
import createError from "http-errors";

export const getContactsController =  async(req, res) => {
    const contacts = await contactsServices.getContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  };


export const getContactByIdController = async(req, res) => {
      const {contactId} = req.params;
    const contact = await contactsServices.getContactById(contactId);

    if (!contact) {
      throw createError(404, `Contact with id ${contactId} not found!`);
      // const error = new Error(`Contact with id ${contactId} not found!`);
      // error.status = 404;
      // throw error;

    };
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
  });

    };

