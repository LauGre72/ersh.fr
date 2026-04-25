import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET;
  const filConducteurApiTarget = env.VITE_FIL_CONDUCTEUR_API_TARGET || "http://localhost:5100";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      proxy: {
        ...(apiTarget
          ? {
              "/api": {
                target: apiTarget,
                changeOrigin: true,
                secure: false,
              },
            }
          : {}),
        "/fc": {
          target: filConducteurApiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/fc/, "") || "/",
        },
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
