let ordersDao;

switch (process.env.DAO_TYPE_ORDERS) {
    case "MONGODB":
        const { default : OrdersDaoMongo } = await import ("./OrdersDaoMongo.js")
        ordersDao = new OrdersDaoMongo()
        break
}

export default ordersDao;