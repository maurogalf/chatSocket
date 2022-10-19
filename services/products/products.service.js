import productsDao from "../../data/modules/products/daoFactory.js";

class ProductService {
  saveProduct(product, filename) {
    const { name, description, category, code, price, stock } = product;
    const newProduct = {
      name,
      description,
      category,
      code,
      thumbnail: filename,
      price,
      stock,
      timestamp: new Date(),
    };
    productsDao.saveProduct(newProduct);
    return "product saved successfully";
  }

  async getProducts() {
    try {
      const products = await productsDao.getProducts();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsByCategory(category) {
    try {
      return category === undefined
        ? await this.getProducts()
        : await productsDao.getProductsByCategory(category);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductByCode(code) {
    return await productsDao.getProductByCode(code);
  }

  async getProductById(id) {
    try {
      const product = await productsDao.getProductById(id);
      if (product === null) throw new Error(`Product not found "${id}"`);
      return product;
    } catch (error) {
      throw new Error(`Error getting product "${id}"`);
    }
  }

  async updateProduct(id, product) {
    return await productsDao.updateProduct(id, product);
  }

  async deleteProduct(id) {
    return await productsDao.deleteProduct(id);
  }
}

export const productService = new ProductService();
