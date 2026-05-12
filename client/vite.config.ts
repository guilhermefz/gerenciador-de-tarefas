import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
    },
    test: {
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'html'],
        },
        globals: true,
    },
    server: {
        host: '127.0.0.1',
        strictPort: true,
    },
});
