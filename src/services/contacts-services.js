import ContactCollection from "../db/models/Contacts.js";

import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        filter = {}}) => {
    const limit = perPage;
    const skip = (page - 1) * limit;

    const contactsQuery = ContactCollection.find();

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }
    if (filter.isFavorite) {
        contactsQuery.where('isFavorite').equals(filter.isFavorite);
    }
    if (filter.userId) {
        contactsQuery.where('userId').equals(filter.userId);
    }

    const totalItems = await ContactCollection.find().merge(contactsQuery).countDocuments();
    const data = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
    const paginationData = calcPaginationData({page, perPage, totalItems});

    return {
        data,
        ...paginationData
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
