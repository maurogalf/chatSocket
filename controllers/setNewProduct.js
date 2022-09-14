import { saveProduct } from "../services/products/Products.js";

export const setNewProduct = (req, res) => {
    saveProduct(req.body)
    res.redirect("/");
};
