import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      proxy: apiTarget
        ? {
            "/api": {
              target: apiTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    build: {
      sourcemap: true,
    },
  };
});
