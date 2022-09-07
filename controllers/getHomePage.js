import daosContenedor from "../data/daos/index.js";
import { products } from "../services/products.js";
import logger from "../tools/winston.js";

const getHomePage = async (req, res, next) => {
    try {
        const prods = await products.getProducts();
        const messages = await daosContenedor.getMessages();
        const compresion = await daosContenedor.compresion();
        res.render("home", {
            products: prods,
            chat: messages.mensajes,
            compresion: compresion,
            user: req.user.username,
        });
    } catch (error) {
        logger.error(error);        
    }
};

export default getHomePage;
