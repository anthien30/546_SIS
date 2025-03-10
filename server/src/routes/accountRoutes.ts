import express from "express";
import { getAccounts, registerAccount } from "../controllers/accountController";

const router = express.Router();

router.post("/register", registerAccount);
router.get("/search", getAccounts);

export default router;
