import { saveUser } from "../services/users/Users.js";

export const setNewUser = (req, res) => {
    saveUser(req.body, req.file.filename)
    res.redirect("/");
};
