import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Load env file based on `mode` (development or production)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "https://e-commerce-back-4ahw.onrender.com/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
