import { jwtGenerate } from "../tools/jwt.js";

class JwtMiddleware {
  setHeaders(req, res, next) {
    const user = req.user.username;
    const token = jwtGenerate({ user });
    res.setHeader("authorization", "Bearer " + token);
    next();
  }

  verifyAutentication(req, res, next) {}

  verifyAutorization(req, res, next) {}
}

export const jwtMiddleware = new JwtMiddleware();
