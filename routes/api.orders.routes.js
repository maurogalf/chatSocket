import Router from "express";
import { apiOrdersController } from "../controllers/api/api.orders.controller.js";

const apiOrdersRouter = new Router();

apiOrdersRouter.get("/", apiOrdersController.getAllOrders);

apiOrdersRouter.get("/:email", apiOrdersController.getOrdersByEmail);

apiOrdersRouter.post("/:email", apiOrdersController.sendOrder);

export default apiOrdersRouter;
