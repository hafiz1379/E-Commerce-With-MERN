import express from "express";
import dotenv from "dotenv";
import process from "process";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import connectToDatabase from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoute.js";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

// ✅ CORS configuration (multi-origin support)
const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-front-rxj6.onrender.com/", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const server = app.listen(process.env.PORT, () => {
  connectToDatabase();
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log(
    "Shutting down the server due to the Unhandled Promise Rejection"
  );
  server.close(() => {
    process.exit(1);
  });
});

export default app;
