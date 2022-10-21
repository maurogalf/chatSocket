import { jwtVerify } from "../tools/jwt.js";
import logger from "../tools/winston.js";

class JwtMiddleware {
  tokenVerify(req, res, next) {
    try {
      logger.info("Token verify", req.body.token);
      const result = jwtVerify(req.body.token);
      next();
    } catch (err) {
      res.status(401).send({ Error: err.message });
    }
  }
}

export const jwtMiddleware = new JwtMiddleware();
