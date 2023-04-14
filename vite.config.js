import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
              'resources/css/app.css',
              'resources/js/app.js',
              'resources/js/vh.js',
              'resources/js/map.js',
              'resources/js/map1.js',
              'resources/js/map2.js',
              'resources/js/map3.js',
            ],
            refresh: true,
        }),
    ],
});