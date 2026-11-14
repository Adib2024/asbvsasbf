import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Relative base so the same build works on GitHub Pages (/repo/) and at a domain root.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'ASBF vs ASB Calculator',
        short_name: 'ASBF vs ASB',
        description:
          'Bandingkan pembiayaan ASB (ASBF) dengan simpanan tunai ASB. Compare ASB financing against saving cash in ASB.',
        lang: 'ms',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f4f6fb',
        theme_color: '#1d4ed8',
        categories: ['finance', 'utilities'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
