import productsDao from "../../data/modules/products/daoFactory.js";

export const saveProduct = (product) => {
  const { name, description, code, thumbnail, price, stock } = product;
  const newProduct = {
    name,
    description,
    code,
    thumbnail,
    price,
    stock,
    timestamp: new Date(),
  };
  productsDao.saveProduct(newProduct);
  return "product saved successfully";
};

export const getProducts = async () => {
  try {
    const products = await productsDao.getProducts();
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (id) => {
  return await productsDao.getProductById(id);
};

export const updateProduct = async (id, product) => {
  const response = await productsDao.updateProduct(id, product);
  return "product updated successfully";
};

export const deleteProduct = async (id) => {
  const response = await productsDao.deleteProduct(id);
  return "product deleted";
};
