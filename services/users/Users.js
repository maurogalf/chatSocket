import { registerMail } from "../../tools/nodemailer.js";
import { getProducts } from "../products/Products.js";
import usersDao from "../../data/modules/userInfo/daoFactory.js";

export const getCartUser = async (user) => {
    const cart = await usersDao.getCart(user);
    const empty = cart.length === 0;
    let userCart = [];
    if (!empty) {
        const allProducts = await getProducts();
        cart.map((cartProd) => {
            const prod = allProducts.find((p) => p.code === cartProd.code);
            userCart.push({ ...prod, cant: cartProd.cant });
        });
    }
    return userCart;
}

export const saveUser = async (user, filename) => {
    const { username, name, address, age, phone, area } = user;
    const newUser = {
        username,
        name,
        address,
        age,
        phone: `${area}${phone}`,
        avatar: filename,
    };
    registerMail(newUser);  
    usersDao.saveUser(newUser);
};

export const removeFromCart = ( user, prod ) => {
    usersDao.removeFromCart(user, prod);
}

export const getUserInfo = async (user) => {
    return await usersDao.getUserInfo(user);
}

export const addProductToCart = ( user, prod ) => {
    usersDao.addToCart(user, prod);
}

export const cleanCart = ( user ) => {
    usersDao.cleanCart(user);
}