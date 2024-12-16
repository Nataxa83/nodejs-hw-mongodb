import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

// const DbHost = getEnvVar("DB_HOST");

export const initMongoConnection= async () => {
    try {
        const user = getEnvVar('MONGODB_USER');
        const pwd = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');
        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,);
        // await mongoose.connect(DbHost);
        console.log("Mongo connection successfully established!");
    }
    catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};
