import { cartService } from "../../services/cart/cart.service.js";
import { ordersService } from "../../services/orders/orders.service.js";
import { productService } from "../../services/products/products.service.js";
import { userService } from "../../services/users/userInfo.service.js";
import { countryCodes } from "../../tools/datafiles/countryCodes.js";
import logger from "../../tools/winston.js";

class FrontendController {
  getLoginPage(req, res) {
    res.render("login");
  }

  getRegisterPage(req, res) {
    res.render("register", { countryCodes: countryCodes });
  }

  getFailLoginPage(req, res) {
    res.render("login", { error: true });
  }

  getFailRegisterPage(req, res) {
    res.render("register", { countryCodes: countryCodes, error: true });
  }

  getFormPage(req, res) {
    res.render("form");
  }

  async getHomePage(req, res) {
    const prods = await productService.getProductsByCategory(
      req.params.category
    );
    const category = {
      all: req.params.category === undefined,
      data: req.params.category === "data",
      programacion: req.params.category === "programacion",
      diseno: req.params.category === "diseno",
    };
    res.render("home", {
      products: prods,
      user: req.user.username,
      category: category,
    });
  }

  async sendOrder(req, res) {
    const order = await ordersService.sendOrder(req.user.username);
    res.redirect(`/orders/${order.order_id}`);
  }

  async showOneOrder(req, res) {
    const order = await ordersService.getUserOrderById(
      req.params.id,
      req.user.username
    );
    res.render("order", { orders: order, user: req.user.username });
  }

  async showOrders(req, res) {
    const orders = await ordersService.getOrdersByEmail(req.user.username);
    res.render("order", { orders: orders.reverse(), user: req.user.username });
  }
}

export const frontendController = new FrontendController();
