import { Schema, model } from "mongoose";
import { typeList } from "../../constants/contacts.js";
import { handleSaveError, setUpdateSet } from "./hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: typeList,
        default: 'personal',
    },
},
   {
        versionKey: false,
       timestamps: true,
    },
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSet);

contactSchema.post("findOneAndUpdate", handleSaveError);


const ContactCollection = model("contact", contactSchema);

export default ContactCollection;

