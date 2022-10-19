import mongoose from "mongoose";
import logger from "../../../tools/winston.js";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER);

mongoose.connection.on("error", (err) => {
  logger.error(err);
});

mongoose.connection.on("open", () => {});

const cartSchema = new Schema({
  email: String,
  date: String,
  items: Array,
  address: String,
});

const Carts = mongoose.model("carts", cartSchema);

class CartsDaoMongo {
  async saveCart(cart) {
    const newCart = new Carts(cart);
    await newCart.save();
    return newCart;
  }

  async getAllCarts() {
    return await Carts.find().lean();
  }

  async getCartByEmail(email) {
    return await Carts.findOne({ email: email }).lean();
  }

  async updateCartByEmail(cart) {
    return await Carts.findOneAndUpdate({ email: cart.email }, cart);
  }

  async deleteCartByEmail(email) {
    return await Carts.findOneAndDelete({ email: email });
  }
}

export default CartsDaoMongo;
