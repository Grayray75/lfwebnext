import { resolve } from 'node:path';
import { globSync } from 'glob';

/** @type {import('vite').UserConfig} */
export default {
    root: resolve(__dirname, 'src'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: globSync(resolve(__dirname, 'src', '*.html'), { windowsPathsNoEscape: true })
        }
    }
};
