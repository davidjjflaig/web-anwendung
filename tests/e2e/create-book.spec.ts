import { test, expect } from '@playwright/test';

test('Ein neues Buch kann erfolgreich angelegt werden', async ({ page }) => {
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'p';

  await page.goto('/login');

  await page.getByLabel('Benutzername').fill(username);
  await page.getByLabel('Passwort').fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/buecher$/);

  await page.goto('/buecher/neu');

  await expect(page.getByText('Neues Buch erfassen')).toBeVisible();

  const uniqueIsbn = `978-${Date.now()}`;

  await page.getByLabel('Titel').fill('E2E Testbuch');
  await page.getByLabel('Untertitel').fill('Automatisierter Test');

  await page.getByLabel('ISBN').fill(uniqueIsbn);

  await page.getByLabel('Preis (€)').fill('19.99');

  await page.getByLabel('Homepage URL').fill('https://example.com');

  await page.getByRole('combobox').selectOption('HARDCOVER');

  await page.getByRole('button', { name: 'Buch anlegen' }).click();

  await expect(page).toHaveURL(/\/buecher$/);

  await expect(page.getByText('E2E Testbuch')).toBeVisible();
});
