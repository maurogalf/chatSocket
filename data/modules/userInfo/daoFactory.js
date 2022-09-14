let usersDao;

switch (process.env.DAO_TYPE_USERS) {
    case "MONGODB":
        const { default : UsersInfoDaoMongo } = await import ("./UsersInfoDaoMongo.js")
        usersDao = new UsersInfoDaoMongo()
        break
}

export default usersDao;