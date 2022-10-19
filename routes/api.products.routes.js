import Router from "express";
import { apiProductsController } from "../controllers/api/api.products.controller.js";

const apiProductsRouter = new Router();

apiProductsRouter.get("/", apiProductsController.getAllProducts);

apiProductsRouter.get(
  "/category/:category",
  apiProductsController.getProductsByCategory
);

apiProductsRouter.get("/:id", apiProductsController.getProductById);

apiProductsRouter.post("/", apiProductsController.saveNewProduct);

apiProductsRouter.put("/:id", apiProductsController.updateProductById);

apiProductsRouter.delete("/:id", apiProductsController.deleteProductById);

export default apiProductsRouter;
