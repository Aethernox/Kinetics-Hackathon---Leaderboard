import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Vite plugin to ensure public assets (logo.png, robotic_arm.png) are copied to dist
const ensurePublicAssets = () => {
  return {
    name: 'ensure-public-assets',
    buildStart() {
      const rootDir = process.cwd();
      const publicDir = path.resolve(rootDir, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      ['logo.png', 'robotic_arm.png'].forEach((file) => {
        const src = path.resolve(rootDir, file);
        const dest = path.resolve(publicDir, file);
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, dest);
          } catch (e) {
            console.warn(`Could not copy ${file} to public/`, e);
          }
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ensurePublicAssets()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});

