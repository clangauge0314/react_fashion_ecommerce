import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import babel from "vite-plugin-babel";


export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "bundle-analysis.html",
    }),
    babel({
      babelConfig: true 
    }),
  ],
  server: {
    host: process.env.VITE_HOST || "0.0.0.0",
    port: parseInt(process.env.VITE_PORT, 10) || 5173,
  },
  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
