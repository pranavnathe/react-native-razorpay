import mongoose from "mongoose";

const razorpayOrderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        amount: {
            type: Number,
            required: [true, "Purchase amount is required"],
            min: [0, "Amount must be non-negative"],
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "completed", "failed"],
                message: "Please select a valid status",
            },
            default: "pending",
        },
        orderId: {
            type: String,
            required: [true, "Payment ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const RazorpayOrder = mongoose.model(
    "RazorpayOrder",
    razorpayOrderSchema
);
