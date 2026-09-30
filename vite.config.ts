import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "."),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "index.html"),
          browse: path.resolve(import.meta.dirname, "browse.html"),
          booking: path.resolve(import.meta.dirname, "booking.html"),
          dashboard: path.resolve(import.meta.dirname, "dashboard.html"),
          admin: path.resolve(import.meta.dirname, "admin.html"),
          myBookings: path.resolve(import.meta.dirname, "my-bookings.html"),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
