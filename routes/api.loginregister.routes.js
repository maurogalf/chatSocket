import { Router } from "express";
import { apiUsersController } from "../controllers/api/api.users.controller.js";
import passport from "../tools/passport/local-auth.js";

const apiLoginRegister = new Router();

apiLoginRegister.post(
  "/login",
  passport.authenticate("login"),
  apiUsersController.login
);

apiLoginRegister.post("/register");

apiLoginRegister.get("/validatetoken", apiUsersController.checkToken);

export default apiLoginRegister;
