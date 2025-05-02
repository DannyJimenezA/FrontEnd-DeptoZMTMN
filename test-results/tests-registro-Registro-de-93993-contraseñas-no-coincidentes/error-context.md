# Test info

- Name: Registro de usuario >> Muestra error por contraseñas no coincidentes
- Location: C:\Users\ivanh\OneDrive - Universidad Nacional de Costa Rica\4 año 1 ciclo\ing en sistemas 3\FrontEnd-DeptoZMTMN\tests\registro.spec.ts:40:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/register
Call log:
  - navigating to "http://localhost:5173/register", waiting until "load"

    at C:\Users\ivanh\OneDrive - Universidad Nacional de Costa Rica\4 año 1 ciclo\ing en sistemas 3\FrontEnd-DeptoZMTMN\tests\registro.spec.ts:41:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Registro de usuario', () => {
   4 |   test('No permite registrar un email ya registrado', async ({ page }) => {
   5 |     await page.goto('http://localhost:5173/register');
   6 |
   7 |     await page.fill('#nombre', 'Juan');
   8 |     await page.fill('#apellido1', 'Perez');
   9 |     await page.fill('#apellido2', 'Lopez');
  10 |     await page.fill('#telefono', '88888888');
  11 |     await page.fill('#cedula', '123456789');
  12 |     await page.fill('#email', 'camposariel508@gmail.com'); // ya registrado
  13 |     await page.fill('#password', 'Password123');
  14 |     await page.fill('#ConfirmPassword', 'Password123');
  15 |
  16 |     await page.click('button[type="submit"]');
  17 |
  18 |     await expect(page.locator('text=El email ya está registrado')).toBeVisible();
  19 |   });
  20 |
  21 |   test('Muestra error por formato de correo inválido', async ({ page }) => {
  22 |     await page.goto('http://localhost:5173/register');
  23 |
  24 |     await page.fill('#nombre', 'Juan');
  25 |     await page.fill('#apellido1', 'Perez');
  26 |     await page.fill('#apellido2', 'Lopez');
  27 |     await page.fill('#telefono', '88888888');
  28 |     await page.fill('#cedula', '123456789');
  29 |     await page.fill('#email', 'correo-malo');
  30 |     await page.fill('#password', 'Password123');
  31 |     await page.fill('#ConfirmPassword', 'Password123');
  32 |
  33 |     await page.click('button[type="submit"]');
  34 |
  35 |     await expect(
  36 |       page.locator('p.field-error').filter({ hasText: 'Formato de correo inválido' })
  37 |     ).toBeVisible();
  38 |   });
  39 |
  40 |   test('Muestra error por contraseñas no coincidentes', async ({ page }) => {
> 41 |     await page.goto('http://localhost:5173/register');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/register
  42 |
  43 |     await page.fill('#nombre', 'Juan');
  44 |     await page.fill('#apellido1', 'Perez');
  45 |     await page.fill('#apellido2', 'Lopez');
  46 |     await page.fill('#telefono', '88888888');
  47 |     await page.fill('#cedula', '123456789');
  48 |     await page.fill('#email', 'nuevo' + Date.now() + '@test.com'); // válido
  49 |     await page.fill('#password', 'Password123');
  50 |     await page.fill('#ConfirmPassword', 'Password1234');
  51 |
  52 |     await page.click('button[type="submit"]');
  53 |
  54 |     await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
  55 |   });
  56 |
  57 |   test('Permite registrar un nuevo usuario exitosamente', async ({ page }) => {
  58 |     await page.goto('http://localhost:5173/register');
  59 |
  60 |     const emailNuevo = `test${Date.now()}@test.com`;
  61 |
  62 |     await page.fill('#nombre', 'Nuevo');
  63 |     await page.fill('#apellido1', 'Usuario');
  64 |     await page.fill('#apellido2', 'Prueba');
  65 |     await page.fill('#telefono', '88888888');
  66 |     await page.fill('#cedula', '' + Math.floor(Math.random() * 1000000000));
  67 |     await page.fill('#email', emailNuevo);
  68 |     await page.fill('#password', 'Password123');
  69 |     await page.fill('#ConfirmPassword', 'Password123');
  70 |
  71 |     // Capturar el alert
  72 |     let alertText = '';
  73 |     page.once('dialog', async (dialog) => {
  74 |       alertText = dialog.message();
  75 |       expect(alertText).toContain('Usuario registrado exitosamente');
  76 |       await dialog.accept();
  77 |     });
  78 |   
  79 |     await page.click('button[type="submit"]');
  80 |   
  81 |     await page.waitForTimeout(1000);
  82 |   
  83 |     // En lugar de esperar redirección, validamos que el formulario se haya reiniciado o siga visible
  84 |     await expect(page.locator('h2')).toContainText('Registro de Usuario');
  85 |   });
  86 | });
  87 |
```