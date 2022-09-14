import { sendNewOrder } from "../services/orders/Orders.js";

export const setNewOrder = (req, res) => {
    sendNewOrder(req.user.username);
    res.redirect("/cart");
};
