import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token is invalid or expired" });

    (req as any).user = user; // Store decoded user info
    next();
  });
};

export default authenticateToken;
