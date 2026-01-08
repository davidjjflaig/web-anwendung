import { test, expect } from '@playwright/test';

test('Login mit gültigen Zugangsdaten leitet zur Bücherliste weiter', async ({ page }) => {
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'p';

  await page.goto('/login');

  // Wait for either the login page to load or for a redirect to the home page
  const landedUrl = await Promise.race([
    page.waitForURL(/\/login$/, { timeout: 5000 }).then(() => '/login'),
    page.waitForURL(/\/$/, { timeout: 5000 }).then(() => '/'),
  ]).catch(() => undefined);

  if (landedUrl === '/') {
    // The server redirected to home (maybe session exists); verify home
    await expect(page.getByText('Bücher suchen')).toBeVisible();
    return; // already logged in
  }

  await expect(page.getByText('Anmelden')).toBeVisible();

  // Fill login fields by selector (fallback if labels are not accessible on the live server)
  const userInput = page.locator('input[type="text"], input:not([type])').first();
  const passInput = page.locator('input[type="password"]').first();
  await userInput.waitFor({ state: 'visible', timeout: 10000 });
  await userInput.fill(username);
  await passInput.fill(password);

  await Promise.all([page.waitForURL(/\/$/), page.getByRole('button', { name: 'Login' }).click()]);

  await expect(page.getByText('Bücher suchen')).toBeVisible();
});

test('Login mit falschen Zugangsdaten zeigt Fehlermeldung und bleibt auf Login-Seite', async ({
  page,
}) => {
  const wrongUsername = 'falscherUser';
  const wrongPassword = 'falschesPasswort';

  await page.goto('/login');

  await expect(page.getByText('Anmelden')).toBeVisible();

  // Fill login using generic selectors in case labels are not accessible on the live server
  const userInput = page.locator('input[type="text"], input:not([type])').first();
  const passInput = page.locator('input[type="password"]').first();
  await userInput.waitFor({ state: 'visible', timeout: 10000 });
  await userInput.fill(wrongUsername);
  await passInput.fill(wrongPassword);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByText('Login fehlgeschlagen. Überprüfe den Benutzernamen und das Passwort.'),
  ).toBeVisible();

  await expect(page).toHaveURL(/\/login$/);
});
