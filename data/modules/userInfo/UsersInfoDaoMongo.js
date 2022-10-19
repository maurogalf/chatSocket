import mongoose from "mongoose";
import UsersDTO from "./UsersDTO.js";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER);

mongoose.connection.on("error", (err) => {
  console.error(err);
});

mongoose.connection.on("open", () => {});

const userSchema = new Schema({
  username: String,
  name: String,
  address: String,
  age: Number,
  phone: Number,
  avatar: String,
  cart: Array,
  level: String,
});

const UserInfo = mongoose.model("dataUser", userSchema);

class UsersInfoDaoMongo {
  async getAllUsers() {
    return await UserInfo.find().lean();
  }

  async getUserById(userId) {
    const response = await UserInfo.find({ _id: userId }).lean();
    return response[0];
  }

  async getUserByEmail(email) {
    const user = await UserInfo.findOne({ username: email }).lean();
    return user;
  }

  async saveUser(user) {
    const userDto = UsersDTO.create(user);
    const newUser = new UserInfo(userDto);
    return await newUser.save();
  }

  async updateUser(userId, user) {
    return await UserInfo.findOneAndUpdate({ _id: userId }, user);
  }
  async deleteUser(userId) {
    return await UserInfo.findOneAndDelete({ _id: userId });
  }
}

export default UsersInfoDaoMongo;
