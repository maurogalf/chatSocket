import Router from "express";
import { apiUsersController } from "../controllers/api/api.users.controller.js";
import upload from "../tools/storage.js";
import passport from "../tools/passport/local-auth.js";

const apiUsersRouter = new Router();

apiUsersRouter.post(
  "/login",
  passport.authenticate("login"),
  apiUsersController.login
);

apiUsersRouter.get("/", apiUsersController.getAllUsers);

apiUsersRouter.get("/:id", apiUsersController.getUserById);

apiUsersRouter.post("/", upload.single("avatar"), apiUsersController.saveUser);

apiUsersRouter.put(
  "/:id",
  upload.single("avatar"),
  apiUsersController.updateUser
);

apiUsersRouter.delete("/:id", apiUsersController.deleteUser);

export default apiUsersRouter;
