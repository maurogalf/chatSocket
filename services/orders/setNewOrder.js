import { orders } from "../../services/orders.js";
import { userInfo } from "../../services/users.js";
import { newOrderMail } from "../../tools/nodemailer.js";
import { sendMessage, sendWhatsapp } from "../../tools/twilio.js";

export const setNewOrder = (req, res ) => {
    userInfo.getUserInfo(req.user.username).then((user) => {
        const order = {
            order_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
            username: user.username,
            name: user.name,
            cart: user.cart,
        };
        orders.checkOut(order);
        newOrderMail(order);
        sendWhatsapp(order);
        sendMessage(order, user.phone);
        userInfo.cleanCart(req.user.username);
        res.redirect("/cart");
    });
}