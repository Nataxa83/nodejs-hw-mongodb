import ContactCollection from "../db/models/Contacts.js";

import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({page = 1, perPage = 10}) => {
    const limit = perPage;
    const skip = (page - 1) * limit;
    const items = await ContactCollection.find().skip(skip).limit(limit);
    const totalItems = await ContactCollection.countDocuments();

    const paginationData = calcPaginationData({page, perPage, totalItems});

    return {
        items,
        totalItems,
        ...paginationData,

    };
};

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
