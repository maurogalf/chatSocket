import { getCompresion, getMessages } from "../services/chat/Chat.js";
import { getProducts } from "../services/products/Products.js";

export const getHomePage = async (req, res) => {
    const prods = await getProducts();
    const messages = await getMessages();
    const compresion = await getCompresion();
    res.render("home", {
        products: prods,
        chat: messages.mensajes,
        compresion: compresion,
        user: req.user.username,
    });
};
