import ordersDao from "../../data/modules/orders/daoFactory.js";
import { newOrderMail } from "../../tools/nodemailer.js";
import { cartService } from "../cart/cart.service.js";
import { userService } from "../users/userInfo.service.js";

class OrdersService {
  async getAllOrders() {
    return await ordersDao.getAllOrders();
  }

  async getOrdersByEmail(email) {
    return await ordersDao.getOrdersByEmail(email);
  }

  async getUserOrderById(id, email) {
    const orders = await this.getOrdersByEmail(email);
    const order = orders.filter((ord) => ord.order_id == id);
    return order;
  }

  async sendOrder(email) {
    const cart = await cartService.getCartByEmail(email);
    if (cart.items.length === 0) return "User cart empty, nothing to send.";
    const user = await userService.getUserByEmail(email);
    const allOrders = await this.getAllOrders();
    const newOrder = {
      order_id:
        allOrders.length === 0
          ? 1
          : Number(allOrders[allOrders.length - 1].order_id) + 1,
      email: user.username,
      name: user.name,
      address: user.address,
      date: new Date().toISOString(),
      state: "Generated",
      items: [],
      total: 0,
    };
    cart.items.map((p) => {
      newOrder.total += p.cant * p.price;
      newOrder.items.push({
        code: p.code,
        cant: p.cant,
        name: p.name,
        description: p.description,
        price: p.price,
        total: p.price * p.cant,
      });
    });
    ordersDao.createOrder(newOrder);
    newOrderMail(newOrder);
    cartService.deleteCartByEmail(email);
    return newOrder;
  }
}

export const ordersService = new OrdersService();
