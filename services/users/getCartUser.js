import { products } from "../../services/products.js";
import { userInfo } from "../../services/users.js";

export const getCartUser = async (user) => {
    const cart = await userInfo.getCart(user);
    const empty = cart.length === 0;
    let userCart = [];
    if (!empty) {
        const allProducts = await products.getProducts();
        cart.map((cartProd) => {
            const prod = allProducts.find((p) => p.code === cartProd.code);
            userCart.push({ ...prod, cant: cartProd.cant });
        });
    }
    return userCart;
}