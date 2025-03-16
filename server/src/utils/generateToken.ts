import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const generateToken = (username: string) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "7Days" });
};

export default generateToken;
