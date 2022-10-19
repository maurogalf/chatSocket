import Router from "express";
import { apiCartsController } from "../controllers/api/api.carts.controller.js";

const apiCartsRouter = new Router();

apiCartsRouter.get("/", apiCartsController.getAllCarts);

apiCartsRouter.get("/:email", apiCartsController.getCartByEmail);

apiCartsRouter.post("/:email", apiCartsController.saveProductInCart);

apiCartsRouter.put("/:email", apiCartsController.removeProductFromCart);

apiCartsRouter.delete("/:email", apiCartsController.deleteCartByEmail);

export default apiCartsRouter;
