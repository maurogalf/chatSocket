import { removeFromCart } from "../services/users/Users.js"

export const removeProduct = (req, res ) => {
    removeFromCart(req.user.username, req.params.code);
    res.redirect("/cart");
}