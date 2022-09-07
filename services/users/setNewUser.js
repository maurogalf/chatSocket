import { userInfo } from "../../services/users.js";


export const setNewUser = (req, res) => {
    const { username, name, address, age, phone, area } = req.body;
    const newUser = {
        username,
        name,
        address,
        age,
        phone: `${area}${phone}`,
        avatar: req.file.filename,
    };
    registerMail(newUser);
    userInfo.saveUser(newUser);
    res.redirect("/");
};
