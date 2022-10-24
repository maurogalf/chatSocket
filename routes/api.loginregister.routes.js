import { Router } from "express";
import { apiUsersController } from "../controllers/api/api.users.controller.js";
import { jwtMiddleware } from "../middleware/jwt.middleware.js";
import passport from "../tools/passport/local-auth.js";

const apiLoginRegister = new Router();

apiLoginRegister.post(
  "/login",
  passport.authenticate("login"),
  apiUsersController.login
);

apiLoginRegister.post("/register");

export default apiLoginRegister;
