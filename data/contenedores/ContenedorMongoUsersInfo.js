import mongoose from "mongoose";
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
    cart: Array
});

const UserInfo = mongoose.model("dataUser", userSchema);

class contUserInfo {
    async saveUser(user) {
        const newUser = new UserInfo();
        newUser.username = user.username;
        newUser.name = user.name;
        newUser.address = user.address;
        newUser.age = user.age;
        newUser.phone = user.phone;
        newUser.avatar = user.avatar;
        newUser.cart = [];
        await newUser.save();
    }

    async getUserInfo(username) {
        const response = await UserInfo.find({ username: username }).lean();
        return response[0];
    }

    async addToCart(user, code) {
        let newUserInfo = await this.getUserInfo(user)
        const index = newUserInfo.cart.map(object => object.code).indexOf(code);
        if(newUserInfo.cart.length === 0 || index === -1) {
            newUserInfo.cart.push({ code:code, cant: 1})
        } else {
            newUserInfo.cart[index].cant = newUserInfo.cart[index].cant + 1; 
        }
        await UserInfo.findOneAndUpdate( { username: user }, newUserInfo )
        return newUserInfo;
    }

    async getCart(user) {
        const response = await UserInfo.find({ username: user}).lean();
        return response[0].cart
    }

    async removeFromCart(user, code) {
        let newUserInfo = await this.getUserInfo(user)
        newUserInfo.cart = newUserInfo.cart.filter(product=> product.code !== code);
        await UserInfo.findOneAndUpdate( { username: user }, newUserInfo )
    }

    async cleanCart ( user ) {
        let newUserInfo = await this.getUserInfo(user)
        newUserInfo.cart = [];
        await UserInfo.findOneAndUpdate( { username: user }, newUserInfo )
    }
}

export default contUserInfo;
