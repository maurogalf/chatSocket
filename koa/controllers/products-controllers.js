import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../../services/products/Products.js";

class ProductsController {
  async getAllProducts(ctx) {
    const products = await getProducts();
    ctx.body = await products;
  }

  async getProductById(ctx) {
    const { id } = ctx.request.params;
    const product = await getProductById(id);
    ctx.body = product;
  }

  async saveNewProduct(ctx) {
    const product = ctx.request.body;
    const response = await saveProduct(product);
    ctx.body = response;
  }

  async updateProductById(ctx) {
    const { id } = ctx.request.params;
    const response = await updateProduct(id, ctx.request.body);
    ctx.body = response;
  }

  async deleteProductById(ctx) {
    const { id } = ctx.request.params;
    const response = await deleteProduct(id);
    ctx.body = response;
  }
}

export const productsController = new ProductsController();
