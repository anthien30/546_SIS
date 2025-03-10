import mongoose from "mongoose";
import { IAccount } from ".";

const accountSchema = new mongoose.Schema<IAccount>({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdOn: { type: Date, required: false },
  createdBy: { type: String, required: false },
});

const Account = mongoose.model<IAccount>("Account", accountSchema);
export default Account;
