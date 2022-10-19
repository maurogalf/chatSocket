import { userService } from "../../services/users/userInfo.service.js";

class ApiUsersController {
  async getAllUsers(req, res) {
    res.send(await userService.getAllUsers());
  }

  async getUserById(req, res) {
    res.send(await userService.getUserById(req.params.id));
  }

  async saveUser(req, res) {
    res.send(await userService.saveUser(req.body, req.file.filename));
  }

  async updateUser(req, res) {
    res.send(
      await userService.updateUser(req.params.id, req.body, req.file.filename)
    );
  }

  async deleteUser(req, res) {
    res.send(await userService.deleteUser(req.params.user));
  }
}

export const apiUsersController = new ApiUsersController();
