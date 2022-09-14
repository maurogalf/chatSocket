import { getUserInfo } from "../services/users/Users.js";

export const getProfilePage = async (req, res) => {
    const userInformation = await getUserInfo(req.user.username);
    res.render("profile", { user: userInformation });
};
