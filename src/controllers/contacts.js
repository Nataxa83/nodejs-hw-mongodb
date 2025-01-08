import * as contactsServices from "../services/contacts-services.js";
import createError from "http-errors";
import { addContactSchema } from "../validation/contacts.js";


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

export const addContactController = async(req, res) => {
  try{
    await addContactSchema.validateAsync(req.body, {abortEarly: false});

  } catch (error) {
    throw createError(400, error.message);

  }


    // const contact = await contactsServices.addContact(req.body);

    // res.status(201).json({
    //   status: 201,
    //   message: `Successfully created a contact!`,
    //   data: contact,
    // });
};

// export const upsertContactByIdController = async(req, res) => {
//     const {contactId} = req.params;
//     const {isNew, contact} = await contactsServices.updateContactById(contactId, req.body, {upsert: true});

//     const status = isNew ? 201 : 200;

//     res.status(status).json({
//       status,
//       message: `Successfully upserted contact with id ${contactId}!`,
//       data: contact,
//     });
// };

export const patchContactByIdController = async(req, res, next) => {
  const {contactId} = req.params;
  const contact = await contactsServices.updateContactById(contactId, req.body);

  if (!contact) {
    throw createError(404, `Contact with id ${contactId} not found!`);
  }

  res.json({
    status: 200,
    message: `Successfully patched contact with id ${contactId}!`,
    data: contact.contact,
  });
};

export const deleteContactByIdController = async(req, res) => {
  const {contactId} = req.params;
  const contact = await contactsServices.deleteContactById({_id:contactId});

  if (!contact) {
    throw createError(404, `Contact with id ${contactId} not found!`);
  }

  res.status(204).send();
};
