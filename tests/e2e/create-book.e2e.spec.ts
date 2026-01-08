import { expect, test } from '@playwright/test';
const username = 'admin';
const password = 'p';
test('Create a new book', async ({ page }) => {
  try {
  const token = await page.request.post('/auth/token', {
    data: { username, password },
  });
  page.context().addCookies([{ name: 'token', value: token.toString(), domain: 'swe.flaig.io', path: '/' }]);
} catch (error) {
  console.error('Error during authentication:', error);
}
  await page.goto('/buecher/neu');

  await page.getByLabel('Titel').fill('E2E Test Buch');
  await page.getByLabel('Untertitel').fill('Ein Buch erstellt durch einen E2E Test');
  await page.getByLabel('ISBN').fill('978-3-16-148410-0');
  await page.getByLabel('Preis').fill('29.99');
  await page.getByLabel('Rabatt').fill('0.1');
  await page.getByLabel('Rating').fill('4');
  await page.getByLabel('Art').selectOption('EPUB');
  await page.getByLabel('Lieferbar').check();
  await page.getByLabel('Datum').fill('2024-06-15');
  await page.getByLabel('Homepage').fill('www.e2e-test-buch.de');
  await page.getByLabel('Schlagwörter (kommagetrennt)').fill('E2E, Test, Buch');

  await page.getByRole('button', { name: 'Buch erstellen' }).click();

  await expect(page.getByText('Buch erstellt ✅')).toBeVisible();
});
