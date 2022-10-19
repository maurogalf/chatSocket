import Joi from "joi";

const dtoProductSchema = Joi.object().keys({
  name: Joi.string().required().min(2),
  description: Joi.string().required().min(10),
  category: Joi.string().required().min(1),
  code: Joi.string().required().min(2),
  thumbnail: Joi.string().required().min(10),
  price: Joi.number().required().greater(100),
  stock: Joi.number().required().greater(0),
  timestamp: Joi.date().required().min(6),
});

class ProductsDTO {
  constructor(product) {
    this.name = product.name;
    this.description = product.description;
    this.category = product.category;
    this.code = product.code;
    this.thumbnail = product.thumbnail;
    this.price = product.price;
    this.stock = product.stock;
    this.timestamp = product.timestamp;
  }

  static create(product) {
    const result = dtoProductSchema.validate(product);
    if (result.error) {
      throw new Error(result.error);
    }
    return new ProductsDTO(product);
  }
}

export default ProductsDTO;
