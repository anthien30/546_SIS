import mongoose from "mongoose";
import { IAccount } from ".";

const accountSchema = new mongoose.Schema<IAccount>({
  role: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email format!`,
    },
  },
  username: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "Active" },
  password: { type: String, required: true },
  createdOn: { type: Date, required: false },
  createdBy: { type: String, required: false },
});

const Account = mongoose.model<IAccount>("Account", accountSchema);
export default Account;
