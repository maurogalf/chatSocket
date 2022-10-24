import { userService } from "../../services/users/userInfo.service.js";
import { jwtGenerate, jwtVerify } from "../../tools/jwt.js";

class ApiUsersController {
  //HACER EL LOGIN Y REGISTER
  async login(req, res) {
    const user = await userService.getUserByEmail(req.body.username);
    const token = jwtGenerate({ user: user.username, level: user.level });
    res.status(200).send({ token });
  }

  checkToken(req, res) {
    console.log(req.body.token);
    try {
      const result = jwtVerify(req.body.token);
      res.status(200).send(result);
    } catch (error) {
      res.status(401).send(error.message);
    }
  }

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
