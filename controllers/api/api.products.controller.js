import { productService } from "../../services/products/products.service.js";

class ApiProductsController {
  async getAllProducts(req, res) {
    const products = await productService.getProducts();
    res.send(await products);
  }

  async getProductsByCategory(req, res) {
    res.send(await productService.getProductsByCategory(req.params.category));
  }

  async getProductById(req, res) {
    const product = await productService.getProductById(req.params.id);
    res.send(product);
  }

  async saveNewProduct(req, res) {
    const product = req.body;
    const response = await productService.saveProduct(product);
    res.send(response);
  }

  async updateProductById(req, res) {
    const id = req.params.id;
    const response = await productService.updateProduct(id, req.body);
    res.send(response);
  }

  async deleteProductById(req, res) {
    const id = req.params.id;
    const response = await productService.deleteProduct(id);
    res.send(response);
  }
}

export const apiProductsController = new ApiProductsController();
