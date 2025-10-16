import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoute.js";
import connectToDatabase from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down due to an uncaught exception");
  process.exit(1);
});

const app = express();

// Connect to database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // React dev server
  "https://mernecommerce1.netlify.app", // Netlify frontend
  "https://e-commerce-front-rxj6.onrender.com", // Another deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., Postman)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// API routes with /api/v1 prefix
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Example /me endpoint in authRoutes
// authRoutes.js should have:
// router.get("/me", isAuthenticatedUser, getUserProfile);

// Error middleware
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down due to an unhandled promise rejection");
  server.close(() => process.exit(1));
});

export default app;
