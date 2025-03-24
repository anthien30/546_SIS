import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import Account from "../models/Account";

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const account = await Account.findOne({ username });

    if (!account || !(await bcrypt.compare(password, account.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(account.username);
    res.json({ token, role: account.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
