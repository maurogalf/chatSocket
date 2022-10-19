import { cartService } from "../../services/cart/cart.service.js";

class CartsController {
  async getCartUserPage(req, res) {
    const cartUser = await cartService.getCartByEmail(req.user.username);
    res.render("cartDetail", {
      userCart: cartUser.items,
      user: req.user.username,
      showFinish: cartUser.items.length > 0,
    });
  }

  async saveProductInCart(req, res) {
    try {
      await cartService.saveProductInCart(req.params.code, req.user.username);
      res.redirect("/productos");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeProductFromCart(req, res) {
    await cartService.removeProductFromCart(req.params.code, req.user.username);
    res.redirect("/cart");
  }
}

export const cartsController = new CartsController();
