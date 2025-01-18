import createHttpError from "http-errors";
import bcrypt   from "bcrypt";
import {randomBytes} from "crypto";

import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/auth.js";

const createSessionData = payload => ({
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,

});

export const register = async payload => {
    const {email, password} = payload;
    const user = await UserCollection.findOne({ email});

    if (user) {
        throw createHttpError(409, "Email in use");
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

    const sessionData = createSessionData();


    return SessionCollection.create({
        userId: user._id,
       ...sessionData,
    });
};
export const refreshToken = async (payload) => {
            const oldSession = await SessionCollection.findOne({
                _id: payload.sessionId,
                refreshToken: payload.refreshToken,
            });

            if (!oldSession) {
                throw createHttpError(401, "Session not found");
            };

            if(Date.now() > oldSession.refreshTokenValidUntil) {
                throw createHttpError(401, "Session expired");
            };

            await SessionCollection.deleteOne({_id: payload.sessionId});

            const sessionData = createSessionData();

            return SessionCollection.create({
                userId: oldSession.userId,
                ...sessionData,
            });
 };

export const logout = async sessionId => {
    await SessionCollection.deleteOne({_id: sessionId});
};

export const getUser = filter => UserCollection.findOne(filter);

export const getSession = filter => SessionCollection.findOne(filter);
