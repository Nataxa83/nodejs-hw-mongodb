import { Schema, model } from "mongoose";
import { regularExpEmail } from "../../constants/auth.js";
import { handleSaveError, setUpdateSet } from "./hooks.js";

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
        // minlength: 6,
        required: true,
      },
},
{
    versionKey: false,
   timestamps: true,
},
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSet);

userSchema.post("findOneAndUpdate", handleSaveError);

const UserCollection = model ("user", userSchema);

export default UserCollection;


