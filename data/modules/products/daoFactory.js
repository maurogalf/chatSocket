let productsDao;

switch (process.env.DAO_TYPE_PRODUCTS) {
    case "MONGODB":
        const { default : ProductsDaoMongo } = await import ("./ProductsDaoMongo.js")
        productsDao = new ProductsDaoMongo()
        break
}

export default productsDao;