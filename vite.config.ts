import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const disableHmr = process.env.DISABLE_HMR === 'true';
  const hmrHost =
    process.env.VITE_HMR_HOST ||
    'ais-dev-wiv3b3jqvug3d5hx2xke36-141953450050.asia-southeast1.run.app';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: disableHmr
        ? false
        : {
            clientPort: Number(process.env.VITE_HMR_CLIENT_PORT || 443),
            protocol: (process.env.VITE_HMR_PROTOCOL as 'wss' | 'ws') || 'wss',
            host: hmrHost,
          },
      watch: disableHmr ? null : {},
    },
  };
});
