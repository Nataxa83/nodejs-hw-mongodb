import {Router} from "express";

import * as authController from "../controllers/auth.js";

import { validateBody } from "../utils/validateBody.js";
import { authRegisterSchema, authLoginSchema, requestResetEmailSchema, resetPasswordSchema} from "../validation/auth.js";

import { ctrWrapper } from "../utils/ctrWrapper.js";

const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrWrapper(authController.registerController));

// authRouter.get("/verify", ctrWrapper(authController.verifyEmailController));

authRouter.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrWrapper(authController.sendResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrWrapper(authController.resetPasswordController));


authRouter.post("/login", validateBody(authLoginSchema), ctrWrapper(authController.loginController));

authRouter.post("/refresh",ctrWrapper(authController.refreshTokenController));

authRouter.post("/logout",ctrWrapper(authController.logoutController));

export default authRouter;
