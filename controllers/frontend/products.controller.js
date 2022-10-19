import { productService } from "../../services/products/products.service.js";

class ProductsController {
  async getProductPage(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.render("detail", { user: req.user.username, product: product });
    } catch (error) {
      logger.warn(error.message);
      res.render("detail", {
        user: req.user.username,
        error: true,
        errorMessage: error.message,
      });
    }
  }

  setNewProduct(req, res) {
    productService.saveProduct(req.body, req.file.filename);
    res.redirect("/productos");
  }
}

export const productsController = new ProductsController();
