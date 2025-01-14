import createHttpError from "http-errors";
import { getSession, getUser } from "../services/auth.js";

export const authenticate = async (req, res, next) => {
const authHeader = req.get("Authorization");
if (!authHeader) {
    return next(createHttpError(401, "Authorization header is missing"));
}
const [bearer, accessToken] = authHeader.split(" ");
    if(bearer !== "Bearer") {
        return next(createHttpError(401, "Authorization header is invalid"));
    }

const session = await getSession({accessToken});

if (!session) {
    return next(createHttpError(401, "Access token is invalid"));
}

if(Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, "Access token expired"));
}

const user = await getUser ({_id: session.userId});
if(!user) {
    return next(createHttpError(401, "User not found"));
}

// req.user = user;

next();
};
