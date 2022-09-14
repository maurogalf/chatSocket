import { addProductToCart } from "../services/users/Users.js";

export const setNewProductToCartUser = (req, res )  => {
    addProductToCart(req.user.username, req.params.code);
    res.redirect("/");
}