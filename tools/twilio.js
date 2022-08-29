const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";
const client = twilio(accountSid, authToken);

export const sendWhatsapp = (order) => {
    client.messages
        .create({
            body: `New order info:
        Username: ${order.username}
        Name: ${order.name}
        Id: ${order.order_id}
        Cart Detail : ${order.cart.map(
            (prod) => `Product: ${prod.code} - Cant: ${prod.cant}
        `
        )}`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:+549${process.env.ADMIN_PHONE_NUMBER}`,
        })
        .then((message) => console.log(message.sid))
        .done();
};

export const sendMessage = (order, phone) => {
    client.messages
        .create({
            body: `Your order was sent successfully, it was created with the id ${order.order_id}`,
            messagingServiceSid: "MGbc93a8e9d82fc6feff7a9580af35f82f",
            to: `${phone}`,
        })
        .then((message) => console.log(message.sid))
        .done();
};
