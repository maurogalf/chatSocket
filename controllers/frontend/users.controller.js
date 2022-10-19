import { userService } from "../../services/users/userInfo.service.js";

class UserController {
  setNewUser(req, res) {
    userService.saveUser(req.body, req.file.filename);
    res.redirect("/");
  }

  async getProfilePage(req, res) {
    const userInformation = await userService.getUserByEmail(req.user.username);
    res.render("profile", { user: userInformation });
  }
}

export const userController = new UserController();
