import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../../services/products/Products.js";

class ApiController {
  async getAllProducts(req, res) {
    const products = await getProducts();
    res.send(await products);
  }

  async getProductById(req, res) {
    const id = req.params.id;
    const product = await getProductById(id);
    res.send(product);
  }

  async saveNewProduct(req, res) {
    const product = req.body;
    const response = await saveProduct(product);
    res.send(response);
  }

  async updateProductById(req, res) {
    const id = req.params.id;
    const response = await updateProduct(id, req.body);
    res.send(response);
  }

  async deleteProductById(req, res) {
    const id = req.params.id;
    const response = await deleteProduct(id);
    res.send(response);
  }
}

export const apiController = new ApiController();
