import createError from "http-errors";

import * as contactsServices from "../services/contacts-services.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";

import { parseSortParams } from "../utils/parseSortParams.js";

import { sortByList } from "../db/models/Contacts.js";

import {parseFilterParams} from "../utils/filters/parseFilterParams.js";

import {saveFileToUploadsDir} from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

import { getEnvVar } from "../utils/getEnvVar.js";

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
      const {_id: userId} = req.user;
      const {contactId: _id} = req.params;
    const contact = await contactsServices.getContact({_id, userId});

    if (!contact) {
      throw createError(404, `Contact with id ${_id} not found!`);
      // const error = new Error(`Contact with id ${contactId} not found!`);
      // error.status = 404;
      // throw error;

    };
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${_id}!`,
      data: contact,
  });

    };

export const addContactController = async(req, res) => {
  //  console.log(req.body);
  //  console.log(req.file);

  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === "true";

  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  const {_id: userId} = req.user;
    const contact = await contactsServices.addContact({...req.body, photo, userId});

    res.status(201).json({
      status: 201,
      message: `Successfully created a contact!`,
      data: contact,
    });
};

};

export const upsertContactByIdController = async(req, res) => {

    const {contactId} = req.params;
    const {_id: userId} = req.user;
    const {isNew, contact} = await contactsServices.updateContactById(contactId, {...req.body, userId}, {upsert: true});

    const status = isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted contact with id ${contactId}!`,
      data: contact,
    });
};

export const patchContactByIdController = async(req, res, next) => {

  const {contactId: _id} = req.params;
  const {_id: userId} = req.user;
  const contact = await contactsServices.updateContactById({_id, userId},req.body );

  if (!contact) {
    throw createError(404, `Contact with id ${_id} not found!`);
  }

  res.json({
    status: 200,
    message: `Successfully patched contact with id ${_id}!`,
    data: contact.contact,
  });
};

export const deleteContactByIdController = async(req, res) => {
  const {contactId: _id} = req.params;
  const {_id: userId} = req.user;
  const contact = await contactsServices.deleteContactById({_id, userId});

  if (!contact) {
    throw createError(404, `Contact with id ${_id} not found!`);
  }

  res.status(204).send();
};

