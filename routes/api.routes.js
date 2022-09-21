import Router from "express";
import { apiController } from "../controllers/api/api.controller.js";

const apiRouter = new Router();

apiRouter.get("/products", apiController.getAllProducts);

apiRouter.get("/products/:id", apiController.getProductById);

apiRouter.post("/products", apiController.saveNewProduct);

apiRouter.put("/products/:id", apiController.updateProductById);

apiRouter.delete("/products/:id", apiController.deleteProductById);

export default apiRouter;
