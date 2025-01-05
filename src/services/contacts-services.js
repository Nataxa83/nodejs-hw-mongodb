import ContactCollection from "../db/models/Contacts.js";

export const getContacts =  () => ContactCollection.find();

export const getContactById = (contactId) => ContactCollection.findById(contactId);

export const addContact = (contact) => ContactCollection.create(contact);
