import { userInfo } from "../services/users.js";

export const getProfilePage = async (req, res) => {
    const userInformation = await userInfo.getUserInfo(req.user.username);
    res.render("profile", { user: userInformation });
};
