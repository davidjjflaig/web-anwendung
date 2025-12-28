import { test, expect } from '@playwright/test';

test('Login mit gültigen Zugangsdaten leitet zur Bücherliste weiter', async ({ page }) => {
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'p';

  await page.goto('/login');

  await expect(page.getByText('Anmelden')).toBeVisible();

  await page.getByLabel('Benutzername').fill(username);
  await page.getByLabel('Passwort').fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/buecher$/);

  await expect(page.getByText('Verfügbare Bücher')).toBeVisible();
});

test('Login mit falschen Zugangsdaten zeigt Fehlermeldung und bleibt auf Login-Seite', async ({
  page,
}) => {
  const wrongUsername = 'falscherUser';
  const wrongPassword = 'falschesPasswort';

  await page.goto('/login');

  await expect(page.getByText('Anmelden')).toBeVisible();

  await page.getByLabel('Benutzername').fill(wrongUsername);
  await page.getByLabel('Passwort').fill(wrongPassword);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByText('Login fehlgeschlagen. Überprüfe den Benutzernamen und das Passwort.'),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/login$/);
});
