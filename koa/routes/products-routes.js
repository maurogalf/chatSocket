import router from "koa-router";
import { productsController } from "../controllers/products-controllers.js";

const productsRoute = router({ prefix: "/products" });

productsRoute.get("/", productsController.getAllProducts);

productsRoute.get("/:id", productsController.getProductById);

productsRoute.post("/", productsController.saveNewProduct);

productsRoute.put("/:id", productsController.updateProductById);

productsRoute.delete("/:id", productsController.deleteProductById);

export default productsRoute;
