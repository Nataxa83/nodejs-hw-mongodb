import createHttpError from "http-errors";
import bcrypt   from "bcrypt";
import {randomBytes} from "crypto";

import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/auth.js";

export const register = async payload => {
    const {email, password} = payload;
    const user = await UserCollection.findOne({ email});

    if (user) {
        throw createHttpError(409, "User already exists");
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserCollection.create({...payload, password: hashedPassword});

    return newUser;
};

export const login = async ({email, password}) => {
    const user = await UserCollection.findOne({email});

    if (!user) {
        throw createHttpError(401, "Email or password is incorrect");
    };

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw createHttpError(401, "Email or password is incorrect");
    };

    await SessionCollection.deleteOne({userId: user._id});

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    return SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
    });
};
