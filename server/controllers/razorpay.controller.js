import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import { RazorpayOrder } from "../models/razorpayOrder.model.js";

// Load environment variables
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

if ((process.env.NODE_ENV = "development")) {
    console.log(`key_id : ${process.env.RAZORPAY_KEY_ID}`);
    console.log(`key_secret : ${process.env.RAZORPAY_KEY_SECRET}`);
}

export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, name, email, contact } = req.body;

        // Create a new order record
        const newOrder = new RazorpayOrder({
            name,
            amount,
            status: "pending",
        });

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `ordered_by_#${amount}`,
            notes: {
                customer_name: name,
                customer_email: email,
                customer_contact: contact,
            },
        };

        const order = await razorpay.orders.create(options);

        // Save payment ID to purchase record
        newOrder.orderId = order.id;
        await newOrder.save();

        res.status(200).json({
            success: true,
            id: order.id,
            amount,
            customer_email: order.notes.customer_email,
            customer_contact: order.notes.customer_contact,
            customer_name: order.notes.customer_name,
        });
    } catch (error) {
        if ((process.env.NODE_ENV = "development")) {
            console.error("Error creating Razorpay order:", error);
        }
        res.status(500).json({
            message: "Error creating payment order",
            error: error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { paymentData } = req.body;
        if ((process.env.NODE_ENV = "development")) {
            console.log("paymentData", paymentData);
        }

        const razorpay_order_id = paymentData.razorpay_order_id;
        const razorpay_payment_id = paymentData.razorpay_payment_id;
        const razorpay_signature = paymentData.razorpay_signature;

        // Verify payment signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        if ((process.env.NODE_ENV = "development")) {
            console.log("Generated body for HMAC:", body);
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if ((process.env.NODE_ENV = "development")) {
            console.log("Expected Signature:", expectedSignature);
            console.log("Razorpay Signature:", razorpay_signature);
        }

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res
                .status(400)
                .json({ message: "Payment verification failed" });
        }

        // Update purchase record
        const purchase = await RazorpayOrder.findOne({
            orderId: razorpay_order_id,
        });
        if (!purchase) {
            return res
                .status(404)
                .json({ message: "Purchase record not found" });
        }

        purchase.status = "completed";
        await purchase.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            name: purchase.name,
            amount: purchase.amount,
        });
    } catch (error) {
        if ((process.env.NODE_ENV = "development")) {
            console.error("Error verifying payment:", error);
        }
        res.status(500).json({
            message: "Error verifying payment",
            error: error.message,
        });
    }
};
