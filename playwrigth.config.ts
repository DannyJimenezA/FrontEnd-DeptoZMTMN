import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // ⬅️ Aquí Playwright buscará tus archivos .spec.ts
  use: {
    baseURL: 'http://localhost:5173', // ⬅️ Cambia si usas otro puerto
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  retries: 0,
  reporter: 'list',
});
