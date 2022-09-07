import mongoose from "mongoose";
import logger from "../../tools/winston.js";
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

class contenedorProduct {
    async saveProduct(product) {
        const newProduct = new Product();
        newProduct.name = product.name;
        newProduct.description = product.description;
        newProduct.code = product.code;
        newProduct.thumbnail = product.thumbnail;
        newProduct.price = product.price;
        newProduct.stock = product.stock;
        newProduct.timestamp = product.timestamp;
        await newProduct.save();
    }
    async getProducts() {
        const response = await Product.find({}).lean();
        return response;
    }
}

export default contenedorProduct;
