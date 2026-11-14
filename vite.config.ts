import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { devvit } from '@devvit/start/vite';

export default defineConfig({
    plugins: [react(), tailwind(), devvit()],
    server: {
        proxy: {
            '/api': {
                target: 'https://api.weather.gov/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
});
