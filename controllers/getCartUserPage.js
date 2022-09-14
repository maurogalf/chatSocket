import { getCartUser } from "../services/users/Users.js";

export const getCartUserPage = async (req, res) => {
    const cartUser = await getCartUser(req.user.username)
    res.render("cartDetail", {
        userCart: cartUser,
        user: req.user.username,
        showFinish: (cartUser.length > 0),
    });
};
