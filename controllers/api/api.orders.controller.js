import { ordersService } from "../../services/orders/orders.service.js";

class ApiOrdersController {
  async getAllOrders(req, res) {
    res.send(await ordersService.getAllOrders());
  }

  async getOrdersByEmail(req, res) {
    res.send(await ordersService.getOrdersByEmail(req.params.email));
  }

  async sendOrder(req, res) {
    res.send(await ordersService.sendOrder(req.params.email));
  }
}

export const apiOrdersController = new ApiOrdersController();
