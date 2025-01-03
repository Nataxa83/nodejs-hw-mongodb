import * as contactsServices from "../services/contacts-services.js";

export const getContactsController =  async(req, res) => {
    const contacts = await contactsServices.getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  };

export const getContactByIdController = async(req, res) => {
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
  };
