import Joi from "joi";

const usersDtoSchema = Joi.object().keys({
  username: Joi.string().email().required(),
  name: Joi.string().required().min(5),
  address: Joi.string().required().min(5),
  age: Joi.number().required().greater(1),
  phone: Joi.number().required(),
  avatar: Joi.string().required(),
  cart: Joi.array(),
  level: Joi.string().required(),
});

class UsersDTO {
  constructor(user) {
    this.username = user.username;
    this.name = user.name;
    this.address = user.address;
    this.age = user.age;
    this.phone = user.phone;
    this.avatar = user.avatar;
    this.cart = user.cart;
    this.level = user.level;
  }

  static create(user) {
    user.cart = [];
    const result = usersDtoSchema.validate(user);
    if (result.error) {
      throw new Error("Validation error: " + result.error);
    }
    return new UsersDTO(user);
  }
}

export default UsersDTO;
