import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// CORS Configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "device-remember-token",
            "Access-Control-Allow-Origin",
            "Origin",
            "Accept",
        ],
    })
);

// import routes
import healthcheckRouter from "./routes/health.routes.js";
import razorpayRouter from "./routes/razorpay.routes.js";

// routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/razorpay", razorpayRouter);

// Start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
            );
        });
    })
    .catch((error) => {
        console.log(`MonogDB Connection Error`, error);
    });
