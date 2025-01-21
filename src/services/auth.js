import createHttpError from "http-errors";
import bcrypt   from "bcrypt";
import {randomBytes} from "crypto";
import path from "node:path";
import {readFile} from "node:fs/promises";
import Handlebars from "handlebars";
import jwt from "jsonwebtoken";

import SessionCollection from "../db/models/Session.js";
import UserCollection from "../db/models/Users.js";

import {sendEmail} from "../utils/sendEmail.js";
import { getEnvVar } from "../utils/getEnvVar.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/auth.js";

import { TEMPLATES_DIR } from "../constants/index.js";


// const emailTemplatePath = path.join(TEMPLATES_DIR, "verify-email.html");
// const emailTemplateSource = await readFile(emailTemplatePath, "utf-8");


const appDomain = getEnvVar("APP_DOMAIN");
const jwtSecret = getEnvVar("JWT_SECRET");
const {SMTP_FROM} = process.env;

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

    // const template = Handlebars.compile(emailTemplateSource);

    // const token = jwt.sign({email}, jwtSecret, {expiresIn: "1h"});

    // const html = template({
    //     link: `${appDomain}/auth/verify?token=${token}`,
    // });

    // const verifyEmail = {
    //     to: email,
    //     subject: "Verify email",
    //     html,
    // };

    // await sendEmail(verifyEmail);

    return newUser;
};

export const requestResetToken = async (email) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }

    const resetToken = jwt.sign({
        sub: user._id,
        email
    },
        jwtSecret,
        {
            expiresIn: "5m"
        });

        const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, "reset-password-email.html");
        const resetPasswordTemplateSource = (await readFile(resetPasswordTemplatePath)).toString();
    const template = Handlebars.compile(resetPasswordTemplateSource);

    const html = template({
        name:   user.name,
        link: `${appDomain}/auth/reset-pwd?token=${resetToken}`,
    });

    try {
    await sendEmail({
        from: SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html
    });
} catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
  }
};

export const resetPassword = async payload => {
    let entries;
    try {
        entries = jwt.verify(payload.token, jwtSecret);
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
        throw err;
    }
    const user = await UserCollection.findOne({
        email: entries.email,
        _id: entries.sub,
    });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    );
};

// export const verify = async token => {
//     try {
//         const {email} = jwt.verify(token, jwtSecret);
//         const user = await UserCollection.findOne({email});
//         if(!user) {
//             throw createHttpError(401, "User not found");
//         }
//         await UserCollection.findOneAndUpdate({_id: user._id}, {verify: true});
//     }
//     catch(error) {
//         throw createHttpError(401, error.message);
//     }
// };


export const login = async ({email, password}) => {
    const user = await UserCollection.findOne({email});

    if (!user) {
        throw createHttpError(401, "Email or password is incorrect");
    };

    // if (!user.verify) {
    //     throw createHttpError(401, "Email not verified");
    // };

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
