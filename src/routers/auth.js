import {Router} from "express";

import * as authController from "../controllers/auth.js";

import { validateBody } from "../utils/validateBody.js";
import { authRegisterSchema } from "../validation/auth.js";

import { ctrWrapper } from "../utils/ctrWrapper.js";

const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrWrapper(authController.registerController));

export default authRouter;
