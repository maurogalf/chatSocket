import Joi from "joi";

const dtoProductSchema = Joi.object().keys({
    name: Joi.string().required().min(3),
    description: Joi.string().required().min(10),
    code: Joi.string().required().min(2),
    thumbnail: Joi.string().required().min(10),
    price: Joi.number().required().greater(100),
    stock: Joi.number().required().greater(0),
    timestamp: Joi.date().required().min(6)
})

class ProductsDTO {
    constructor(name, description, code, thumbnail, price, stock, timestamp) {
        this.name = name;
        this.description = description;
        this.code = code;
        this.thumbnail = thumbnail;
        this.price = price;
        this.stock = stock;
        this.timestamp = timestamp;
    }

    static create( product ) {
        const result = dtoProductSchema.validate( product );
        if(result.error) {
            throw new Error("Error al validar el formato", result.error);
        }
        return new ProductsDTO( product.name, product.description, product.code, product.thumbnail, product.price, product.stock, product.timestamp);
    }
}

export default ProductsDTO;