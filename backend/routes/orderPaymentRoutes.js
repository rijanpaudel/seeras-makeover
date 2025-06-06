import express from "express";
import { initiatePayment, verifyPayment } from "../controllers/orderPaymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);

export default router;
