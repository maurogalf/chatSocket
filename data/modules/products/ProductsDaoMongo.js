import mongoose from "mongoose";
import logger from "../../../tools/winston.js";
import ProductsDTO from "./ProductsDTO.js";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER);

mongoose.connection.on("error", (err) => {
  logger.error(err);
});

mongoose.connection.on("open", () => {});

const productSchema = new Schema({
  name: String,
  description: String,
  category: String,
  code: String,
  thumbnail: String,
  price: Number,
  stock: Number,
  timestamp: String,
});

const Product = mongoose.model("products", productSchema);

class ProductsDaoMongo {
  async saveProduct(product) {
    const productDto = ProductsDTO.create(product);
    const newProduct = new Product(productDto);
    await newProduct.save();
  }
  async getProducts() {
    const response = await Product.find({}).lean();
    return response;
  }
  async getProductsByCategory(category) {
    return await Product.find({ category: category }).lean();
  }
  async getProductById(id) {
    const response = await Product.findOne({ _id: id }).lean();
    return response;
  }
  async getProductByCode(code) {
    return await Product.findOne({ code: code }).lean();
  }
  async updateProduct(id, product) {
    const response = await Product.findOneAndUpdate({ _id: id }, product);
    return response;
  }
  async deleteProduct(id) {
    const response = await Product.findOneAndDelete({ _id: id });
    return response;
  }
}

export default ProductsDaoMongo;
