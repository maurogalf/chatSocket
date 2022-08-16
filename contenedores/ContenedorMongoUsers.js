import mongoose from "mongoose";
import logger from "../winston.js";
const { Schema } = mongoose;

mongoose.connect("mongodb://localhost:27017/usersDB");

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

mongoose.connection.on("open", () => {});

const userSchema = new Schema({
    username: String,
    password: String,
});

const User = mongoose.model("users", userSchema);

export default User;
