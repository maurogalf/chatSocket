import Joi from "joi";

const ordersDtoSchema = Joi.object().keys({
    order_id: Joi.string().required().min(10),
    username: Joi.string().email().required(),
    name: Joi.string().required().min(3),
    cart: Joi.array().items(Joi.object({ code: Joi.string().required().min(2), cant: Joi.number().required().greater(0)}))
})

class OrderDto {
    constructor(order_id, username, name, cart) {
        this.order_id = order_id;
        this.username = username;
        this.name = name;
        this.cart = cart;
    }

    static create(order) {
        const result = ordersDtoSchema.validate(order);
        if(result.error) {
            throw new Error ("Validation error: " + result.error);
        }
        return new OrderDto(order.order_id, order.username, order.name, order.cart)
    }
}

export default OrderDto;