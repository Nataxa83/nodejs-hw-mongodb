import {typeList} from "../../constants/contacts.js";

const parseContactType = (type) => {
    if  (typeof type !== 'string') return;
    if (!typeList.includes(type)) return;
    return type;
};

const parseIsFavorite = (value) => {
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    };
    return undefined;
};
export const parseFilterParams = ({contactType, isFavorite})=>{

    const parsedType = parseContactType(contactType);
    const parsedFavorite = parseIsFavorite(isFavorite);

    return {
        contactType: parsedType,
        isFavorite: parsedFavorite,
    };
};
