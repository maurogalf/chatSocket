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
    code: String,
    thumbnail: String,
    price: Number,
    stock: Number,
    timestamp: String
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
}

export default ProductsDaoMongo;
