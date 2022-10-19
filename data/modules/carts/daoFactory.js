let daoCarts;

switch (process.env.DAO_TYPE_CARTS) {
  case "MONGODB":
    const { default: CartsDaoMongo } = await import("./CartsDaoMongo.js");
    daoCarts = new CartsDaoMongo();
    break;
}

export default daoCarts;
