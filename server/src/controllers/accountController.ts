import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Account from "../models/Account";
import { IAccount } from "../models";

export const registerAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, username, password, role } = req.body;

    let existingAccount = await Account.findOne({ username });
    if (existingAccount)
      return res.status(400).json({ message: "Username already exists" });
    existingAccount = await Account.findOne({ email });
    if (existingAccount)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password ?? "password", 10);
    const newAccount = new Account({
      role,
      email,
      username,
      password: hashedPassword,
      createdOn: new Date(),
      createdBy: (req as any).user?.username ?? "unknown",
    });

    await newAccount.save();
    res.status(201).json({ message: "Account registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { role, status, username } = req.body;

    if (!username) res.status(400).json({ message: "username is missing" });

    let existingAccount = await Account.findOne({ username });

    if (!existingAccount)
      return res
        .status(400)
        .json({ message: "Account not found with the given id" });

    if (!!role) existingAccount.role = role;
    if (!!status) existingAccount.status = status;

    await existingAccount.save();

    res.status(200).json({
      message: "Account updated successfully",
      account: existingAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAccounts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, email, role, status, sortBy, sortOrder } = req.query;

    // Build a filter object based on the query parameters
    const filters: any = {};
    if (username) filters.username = { $regex: username, $options: "i" }; // 'i' for case-insensitive
    if (email) filters.email = { $regex: email, $options: "i" };
    if (role) filters.role = role;
    if (status) filters.status = status;

    // Define sorting order, defaulting to ascending if not specified
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1; // Use -1 for descending, 1 for ascending
    } else {
      sortOptions.createdOn = -1;
    }

    // Fetch accounts from the database with the applied filters and sorting
    const accounts = await Account.find(filters).sort(sortOptions);

    // Return the filtered accounts
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
