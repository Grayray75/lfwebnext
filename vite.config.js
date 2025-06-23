import { resolve } from 'node:path';
import { globSync } from 'tinyglobby';

/** @type {import('vite').UserConfig} */
export default {
    root: resolve(__dirname, 'src'),
    base: '/lfwebnext/',
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: globSync('src/*.html', { absolute: true })
        }
    }
};
