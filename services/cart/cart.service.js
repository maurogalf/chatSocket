import daoCarts from "../../data/modules/carts/daoFactory.js";
import { productService } from "../products/products.service.js";
import { userService } from "../users/userInfo.service.js";

class CartService {
  async getAllCarts() {
    return await daoCarts.getAllCarts();
  }

  async getCartByEmail(email) {
    let cart = await daoCarts.getCartByEmail(email);
    if (!cart) {
      cart = {
        email,
        date: new Date().toISOString(),
        address: await userService.getAddressByEmail(email),
        items: [],
      };
    } else {
      const products = await productService.getProducts();
      const fullInfoCart = [];
      cart.items.map((product) => {
        const pInfo = products.find((p) => p.code === product.code);
        fullInfoCart.push({ ...product, ...pInfo });
      });
      cart.items = fullInfoCart;
    }
    return cart;
  }

  async saveProductInCart(code, email) {
    const cart = await this.getCartByEmail(email);
    const index = cart.items.map((object) => object.code).indexOf(code);
    if (cart.items.length === 0 || index === -1) {
      cart.items.push({ code: code, cant: 1 });
    } else {
      cart.items[index].cant = cart.items[index].cant + 1;
    }
    !cart._id
      ? await daoCarts.saveCart(cart)
      : await daoCarts.updateCartByEmail(cart);
    return cart;
  }

  async removeProductFromCart(code, email) {
    const cart = await daoCarts.getCartByEmail(email);
    const newCart = cart.items.filter((prod) => prod.code !== code);
    cart.items = newCart;
    await daoCarts.updateCartByEmail(cart);
    return cart;
  }

  async deleteCartByEmail(email) {
    await daoCarts.deleteCartByEmail(email);
    return "Cart deleted successfully.";
  }
}

export const cartService = new CartService();
