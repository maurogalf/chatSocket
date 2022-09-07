import { products } from "../../services/products.js";

export const setNewProduct = (req, res) => {
    const { name, description, code, thumbnail, price, stock } = req.body;
    const newProduct = {
        name,
        description,
        code,
        thumbnail,
        price,
        stock,
        timestamp: new Date(),
    };
    products.saveProduct(newProduct);
    res.redirect("/");
};
