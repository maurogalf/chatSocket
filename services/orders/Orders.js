import ordersDao from "../../data/modules/orders/daoFactory.js";
import { newOrderMail } from "../../tools/nodemailer.js";
import { sendMessage, sendWhatsapp } from "../../tools/twilio.js";
import { cleanCart, getCartUser, getUserInfo } from "../users/Users.js";

export const sendNewOrder = async (user) => {
    const userInfo = await getUserInfo(user);
    const order = {
        order_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
        username: userInfo.username,
        name: userInfo.name,
        cart: userInfo.cart
    }
    ordersDao.checkOut(order);
    newOrderMail(order);
    // sendWhatsapp(order);
    // sendMessage(order, user.phone);
    cleanCart(user);
};
