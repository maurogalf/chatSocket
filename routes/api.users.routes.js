import Router, { request } from "express";
import { apiUsersController } from "../controllers/api/api.users.controller.js";
import upload from "../tools/storage.js";

const apiUsersRouter = new Router();

apiUsersRouter.get("/", apiUsersController.getAllUsers);

apiUsersRouter.get("/email/:email", apiUsersController.getUserByEmail);

apiUsersRouter.get("/:id", apiUsersController.getUserById);

apiUsersRouter.post("/", upload.single("avatar"), apiUsersController.saveUser);

apiUsersRouter.put(
  "/:id",
  upload.single("avatar"),
  apiUsersController.updateUser
);

apiUsersRouter.delete("/:id", apiUsersController.deleteUser);

export default apiUsersRouter;
