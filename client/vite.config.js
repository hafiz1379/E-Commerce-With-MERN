import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
