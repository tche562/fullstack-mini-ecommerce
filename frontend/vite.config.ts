import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            // Return a proper HTTP response instead of Vite error overlay/page
            if (!res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
            }
            res.end(JSON.stringify({ error: "Backend unavailable" }));
          });
        },
      },
    },
  },
});
