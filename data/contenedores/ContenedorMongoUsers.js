import mongoose from "mongoose";
import logger from "../../tools/winston.js";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER);

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

mongoose.connection.on("open", () => {});

const userSchema = new Schema({
    username: String,
    password: String
});

const User = mongoose.model("users", userSchema);

export default User;
