import mongoose from "mongoose";
import logger from "../../tools/winston.js";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER);

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

mongoose.connection.on("open", () => {});

const orderSchema = new Schema({
    order_id: String,
    username: String,
    name: String,
    cart: Array
});

const Order = mongoose.model("orders", orderSchema);

class contenedorOrders {
    async checkOut(order) {
        const newOrder = new Order();
        newOrder.order_id = order.order_id;
        newOrder.username = order.username;
        newOrder.name = order.name;
        newOrder.cart = order.cart;
        await newOrder.save();
    }
}

export default contenedorOrders;
