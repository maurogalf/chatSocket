import Joi from "joi";

const usersDtoSchema = Joi.object().keys({
    username: Joi.string().email().required(),
    name: Joi.string().required().min(5),
    address: Joi.string().required().min(5),
    age: Joi.number().required().greater(1),
    phone: Joi.number().required(),
    avatar: Joi.string().required(),
    cart: Joi.array()
})

class UsersDTO {
    constructor(username, name, address, age, phone, avatar, cart) {
        this.username = username;
        this.name = name;
        this.address = address;
        this.age = age;
        this.phone = phone;
        this.avatar = avatar
        this.cart = cart
    }

    static create(user) {
        user.cart = [];
        const result = usersDtoSchema.validate(user);
        if(result.error) {
            throw new Error ("Validation error: " + result.error);
        }
        return new UsersDTO(user.username, user.name, user.address, user.age, user.phone, user.avatar, user.cart)
    }
}

export default UsersDTO;