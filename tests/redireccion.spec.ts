import { test, expect } from '@playwright/test';

test('Redirige a /login si no está autenticado en /dashboard', async ({ page }) => {
  // Ir directamente a /dashboard
  await page.goto('http://localhost:5174/admin-dashboard'); // asegúrate que la ruta es correcta

  // 1. Verifica que redirige a /login
  await expect(page).toHaveURL(/\/login$/);

  // 2. Verifica que aparece un formulario de login
  await expect(page.locator('form')).toBeVisible();
});
