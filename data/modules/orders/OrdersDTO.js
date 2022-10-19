import Joi from "joi";

const ordersDtoSchema = Joi.object().keys({
  order_id: Joi.number().required().greater(0),
  email: Joi.string().email().required(),
  name: Joi.string().required().min(3),
  address: Joi.string().required().min(3),
  date: Joi.string().required().min(10),
  state: Joi.string().required().min(5),
  items: Joi.array().items(
    Joi.object({
      code: Joi.string().required().min(2),
      cant: Joi.number().required().greater(0),
      name: Joi.string().required().min(2),
      description: Joi.string().required().min(10),
      price: Joi.number().required().greater(10),
      total: Joi.number().required().greater(10),
    })
  ),
  total: Joi.number().required().greater(10),
});

class OrderDto {
  constructor(order) {
    this.order_id = order.order_id;
    this.email = order.email;
    this.name = order.name;
    this.address = order.address;
    this.date = order.date;
    this.state = order.state;
    this.items = order.items;
    this.total = order.total;
  }

  static create(order) {
    const result = ordersDtoSchema.validate(order);
    if (result.error) {
      throw new Error("Validation error: " + result.error);
    }
    return new OrderDto(order);
  }
}

export default OrderDto;
