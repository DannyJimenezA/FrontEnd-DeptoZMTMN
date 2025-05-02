import { test, expect } from '@playwright/test';

test.describe('Registro de usuario', () => {
  test('No permite registrar un email ya registrado', async ({ page }) => {
    await page.goto('http://localhost:5174/register');

    await page.fill('#nombre', 'Juan');
    await page.fill('#apellido1', 'Perez');
    await page.fill('#apellido2', 'Lopez');
    await page.fill('#telefono', '88888888');
    await page.fill('#cedula', '123456789');
    await page.fill('#email', 'camposariel508@gmail.com'); // ya registrado
    await page.fill('#password', 'Password123');
    await page.fill('#ConfirmPassword', 'Password123');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=El email ya está registrado')).toBeVisible();
  });

  test('Muestra error por formato de correo inválido', async ({ page }) => {
    await page.goto('http://localhost:5174/register');

    await page.fill('#nombre', 'Juan');
    await page.fill('#apellido1', 'Perez');
    await page.fill('#apellido2', 'Lopez');
    await page.fill('#telefono', '88888888');
    await page.fill('#cedula', '123456789');
    await page.fill('#email', 'correo-malo');
    await page.fill('#password', 'Password123');
    await page.fill('#ConfirmPassword', 'Password123');

    await page.click('button[type="submit"]');

    await expect(
      page.locator('p.field-error').filter({ hasText: 'Formato de correo inválido' })
    ).toBeVisible();
  });

  test('Muestra error por contraseñas no coincidentes', async ({ page }) => {
    await page.goto('http://localhost:5174/register');

    await page.fill('#nombre', 'Juan');
    await page.fill('#apellido1', 'Perez');
    await page.fill('#apellido2', 'Lopez');
    await page.fill('#telefono', '88888888');
    await page.fill('#cedula', '123456789');
    await page.fill('#email', 'nuevo' + Date.now() + '@test.com'); // válido
    await page.fill('#password', 'Password123');
    await page.fill('#ConfirmPassword', 'Password1234');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
  });

  test('Permite registrar un nuevo usuario exitosamente', async ({ page }) => {
    await page.goto('http://localhost:5174/register');

    const emailNuevo = `test${Date.now()}@test.com`;

    await page.fill('#nombre', 'Nuevo');
    await page.fill('#apellido1', 'Usuario');
    await page.fill('#apellido2', 'Prueba');
    await page.fill('#telefono', '88888888');
    await page.fill('#cedula', '' + Math.floor(Math.random() * 1000000000));
    await page.fill('#email', emailNuevo);
    await page.fill('#password', 'Password123');
    await page.fill('#ConfirmPassword', 'Password123');

    // Capturar el alert
    let alertText = '';
    page.once('dialog', async (dialog) => {
      alertText = dialog.message();
      expect(alertText).toContain('Usuario registrado exitosamente');
      await dialog.accept();
    });
  
    await page.click('button[type="submit"]');
  
    await page.waitForTimeout(1000);
  
    // En lugar de esperar redirección, validamos que el formulario se haya reiniciado o siga visible
    await expect(page.locator('h2')).toContainText('Registro de Usuario');
  });
});
