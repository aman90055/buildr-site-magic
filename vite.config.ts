import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split heavy deps into their own chunks so the initial bundle stays light.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("pdf-lib")) return "pdf-lib";
          if (id.includes("pdfjs-dist")) return "pdfjs";
          if (id.includes("tesseract")) return "tesseract";
          if (id.includes("mammoth")) return "mammoth";
          if (id.includes("xlsx")) return "xlsx";
          if (id.includes("jspdf") || id.includes("html2canvas")) return "jspdf";
          if (id.includes("docx")) return "docx";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-router") || id.includes("@remix-run")) return "router";
          if (id.includes("react-dom") || /[\\/]react[\\/]/.test(id) || id.includes("scheduler")) return "react";
          return "vendor";
        },
      },
    },
  },
}));
