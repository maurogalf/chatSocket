import jwt from "jsonwebtoken";

export const jwtGenerate = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2 days" });

export const jwtVerify = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
    if (err) throw new Error("Invalid token received: ");
    return result;
  });
