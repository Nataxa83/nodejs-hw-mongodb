import createError from "http-errors";

import * as contactsServices from "../services/contacts-services.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";

import { parseSortParams } from "../utils/parseSortParams.js";

import { sortByList } from "../db/models/Contacts.js";

import {parseFilterParams} from "../utils/filters/parseFilterParams.js";

export const getContactsController =  async(req, res) => {
const {page, perPage} = parsePaginationParams(req.query);
const {sortBy, sortOrder} = parseSortParams(req.query, sortByList);
const filter = parseFilterParams(req.query);
filter.userId = req.user._id;

    const contacts = await contactsServices.getContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter});

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

  const {_id: userId} = req.user;
    const contact = await contactsServices.addContact({...req.body, userId});

    res.status(201).json({
      status: 201,
      message: `Successfully created a contact!`,
      contact,
    });
};

export const upsertContactByIdController = async(req, res) => {

    const {contactId} = req.params;
    const {isNew, contact} = await contactsServices.updateContactById(contactId, req.body, {upsert: true});

    const status = isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted contact with id ${contactId}!`,
      data: contact,
    });
};

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

