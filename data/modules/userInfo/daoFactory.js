let usersInfoDao;

switch (process.env.DAO_TYPE_USERS) {
  case "MONGODB":
    const { default: UsersInfoDaoMongo } = await import(
      "./UsersInfoDaoMongo.js"
    );
    usersInfoDao = new UsersInfoDaoMongo();
    break;
}

export default usersInfoDao;
