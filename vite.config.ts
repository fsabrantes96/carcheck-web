import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// As rotas do back não têm prefixo /api: o proxy tira o prefixo antes de
// repassar. Só vale em dev e no preview; produção ainda não tem CORS
// definido (docs/audit.md).
const apiProxy = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
});
