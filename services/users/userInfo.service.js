import usersInfoDao from "../../data/modules/userInfo/daoFactory.js";

class UserService {
  async getAllUsers() {
    return await usersInfoDao.getAllUsers();
  }

  async getUserById(userId) {
    return await usersInfoDao.getUserById(userId);
  }

  async getUserByEmail(email) {
    const user = await usersInfoDao.getUserByEmail(email);
    return user;
  }

  async saveUser(user, filename) {
    const { username, name, address, age, phone, area } = user;
    const newUser = {
      username,
      name,
      address,
      age,
      phone: `${area}${phone}`,
      avatar: filename,
      level: "user",
    };
    // registerMail(newUser);
    usersInfoDao.saveUser(newUser);
  }

  async getAddressByEmail(email) {
    const allUsers = await this.getAllUsers();
    const { address } = allUsers.find((user) => user.username === email);
    return address;
  }

  async updateUser(userId, user, filename) {
    const { username, name, address, age, phone, area } = user;
    const modifyUser = {
      username,
      name,
      address,
      age,
      phone: `${area}${phone}`,
      avatar: filename,
    };
    return await usersInfoDao.updateUser(userId, modifyUser);
  }

  async deleteUser(userId) {
    return await usersInfoDao.deleteUser(userId);
  }
}

export const userService = new UserService();
