import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../services/products/Products.js";

class Resolvers {
  async getProducts() {
    return await getProducts();
  }

  async getProductById(id) {
    return await getProductById(id);
  }

  saveProduct(args) {
    return saveProduct(args);
  }
  updateProduct(args) {
    const { _id } = args;
    delete args._id;
    return updateProduct(_id, args);
  }

  async deleteProduct(id) {
    console.log(id);
    return await deleteProduct(id);
  }
}

export const resolvers = new Resolvers();
