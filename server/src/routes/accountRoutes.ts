import express from "express";
import {
  getAccounts,
  registerAccount,
  updateAccount,
} from "../controllers/accountController";

const router = express.Router();

router.post("/register", registerAccount);
router.post("/update", updateAccount);
router.get("/search", getAccounts);

export default router;
