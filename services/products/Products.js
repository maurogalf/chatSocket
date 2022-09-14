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
};

export const getProducts = async () => {
    return await productsDao.getProducts();
};
