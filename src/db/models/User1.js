import {Schema, model} from "mongoose";

import { handleSaveError, setUpdateSet } from "./hooks.js";

import { regularExpEmail } from "../../constants/auth.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: regularExpEmail,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSet);

userSchema.post("findOneAndUpdate", handleSaveError);

const UserCollection = model("user", userSchema);

export default UserCollection;
