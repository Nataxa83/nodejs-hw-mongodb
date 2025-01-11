import ContactCollection from "../db/models/Contacts.js";

export const getContacts =  () => ContactCollection.find();

export const getContactById = (contactId) => ContactCollection.findById(contactId);

export const addContact = (contact) => ContactCollection.create(contact);

export const updateContactById = async (contactId, contact, options = {}) => {
    const {upsert = false} = options;
    const result = await ContactCollection.findByIdAndUpdate(contactId, contact, {
        upsert,
        includeResultMetadata: true,
    });

    if (!result || !result.value) return null;

    const isNew = Boolean(result.lastErrorObject.upserted);

    return {
        isNew,
        contact: result.value,
    };
};

export const deleteContactById = (contactId) => ContactCollection.findOneAndDelete(contactId);
