import mongoose from "mongoose";
import logger from "../../../tools/winston.js";
import OrderDto from "./OrdersDTO.js";
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

class OrdersDaoMongo {
    async checkOut(order) {
        const dtoOrder = OrderDto.create(order);
        const newOrder = new Order(dtoOrder);
        await newOrder.save();
    }
}

export default OrdersDaoMongo;
