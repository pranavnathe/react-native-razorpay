import { Router } from "express";
import {
    createRazorpayOrder,
    verifyPayment,
} from "../controllers/razorpay.controller.js";

const router = Router();

router.route("/create-order").post(createRazorpayOrder);
router.route("/verify-payment").post(verifyPayment);

export default router;
