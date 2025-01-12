import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {    
        minify: 'esbuild',
        lib: {
            entry: 'src/main.ts',
            name: '@marrsys/utils',
            fileName: (format) => `index.js`,
            formats: ['es'],
        },
        rollupOptions:{
          external: ['reflect-metadata', 'axios', 'fflate', 'dexie']
        }
    },
    plugins: [dts()],
});
