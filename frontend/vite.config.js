import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/game': path.resolve(__dirname, './src/game'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/stores': path.resolve(__dirname, './src/stores'),
        },
    },
    server: {
        port: parseInt(process.env.FRONTEND_PORT || '4200'),
        host: true,
        strictPort: true,
        open: false,
        proxy: {
            '/api': {
                target: "http://localhost:".concat(process.env.BACKEND_PORT || '4201'),
                changeOrigin: true,
                secure: false,
            },
            '/ws': {
                target: "ws://localhost:".concat(process.env.BACKEND_PORT || '4201'),
                ws: true,
                changeOrigin: true,
            },
        },
    },
    preview: {
        port: parseInt(process.env.FRONTEND_PORT || '4200'),
        host: true,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    state: ['zustand'],
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        exclude: ['**/node_modules/**', '**/tests/e2e/**'],
    },
});
