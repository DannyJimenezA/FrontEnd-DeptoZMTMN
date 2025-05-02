# Test info

- Name: Redirige a /login si no está autenticado en /dashboard
- Location: C:\Users\ivanh\OneDrive - Universidad Nacional de Costa Rica\4 año 1 ciclo\ing en sistemas 3\FrontEnd-DeptoZMTMN\tests\redireccion.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin-dashboard
Call log:
  - navigating to "http://localhost:5173/admin-dashboard", waiting until "load"

    at C:\Users\ivanh\OneDrive - Universidad Nacional de Costa Rica\4 año 1 ciclo\ing en sistemas 3\FrontEnd-DeptoZMTMN\tests\redireccion.spec.ts:5:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Redirige a /login si no está autenticado en /dashboard', async ({ page }) => {
   4 |   // Ir directamente a /dashboard
>  5 |   await page.goto('http://localhost:5173/admin-dashboard'); // asegúrate que la ruta es correcta
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin-dashboard
   6 |
   7 |   // 1. Verifica que redirige a /login
   8 |   await expect(page).toHaveURL(/\/login$/);
   9 |
  10 |   // 2. Verifica que aparece un formulario de login
  11 |   await expect(page.locator('form')).toBeVisible();
  12 | });
  13 |
```