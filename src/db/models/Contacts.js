import { Schema, model } from "mongoose";

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
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: ['personal', 'home', 'work'],
        default: 'personal',
    },
},
   {
        versionKey: false,
       timestamps: true,
    },
);

const ContactCollection = model("contact", contactSchema);

export default ContactCollection;

