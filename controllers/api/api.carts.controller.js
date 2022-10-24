import { cartService } from "../../services/cart/cart.service.js";

class ApiCartsController {
  async getAllCarts(req, res) {
    res.send(await cartService.getAllCarts());
  }

  async getCartByEmail(req, res) {
    const cart = await cartService.getCartByEmail(req.params.email);
    res.send(await cart);
  }

  async saveProductInCart(req, res) {
    console.log(req.body);
    res.send(
      await cartService.saveProductInCart(req.body.code, req.params.email)
    );
  }

  async removeProductFromCart(req, res) {
    res.send(
      await cartService.removeProductFromCart(req.body.code, req.params.email)
    );
  }

  async deleteCartByEmail(req, res) {
    res.send(await cartService.deleteCartByEmail(req.params.email));
  }
}

export const apiCartsController = new ApiCartsController();
