import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isLocalHttps = command === "serve" && (env.VITE_LOCAL_HTTPS === "1" || env.VITE_LOCAL_HTTPS === "true");

    let https = false;
    if (isLocalHttps) {
        try {
            const pfxPath = path.resolve(process.cwd(), "intervu-be-https-devcert.pfx");
            https = {
                pfx: fs.readFileSync(pfxPath),
                passphrase: env.VITE_DEV_PFX_PASSPHRASE, // đặt trong .env.local
            };
        } catch (e) {
            console.warn("HTTPS disabled (missing PFX or passphrase):", e.message);
            https = false;
        }
    }

    return {
        plugins: [react()],
        server: {
            host: true,
            https,
        },
    };
});
