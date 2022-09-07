import { userInfo } from "../../services/users.js";

export const setNewProductToCartUser = (req, res )  => {
    userInfo.addToCart(req.user.username, req.params.code);
    res.redirect("/");
}