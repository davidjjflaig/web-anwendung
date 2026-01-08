import { expect, test } from '@playwright/test';
const username = 'admin';
const password = 'p';
const isbn = '978-3-16-148410-0';
const searchisbn = isbn.replace(/-/g, '');
test('Create a new book', async ({ page, request }) => {
  try {
    const response = await request.post('/auth/token', {
      data: { username, password },
    });
    const token = await response.json();
    const authToken = token.access_token;
    await page.context().addCookies([
      {
        name: 'token',
        value: authToken,
        domain: 'swe.flaig.io',
        path: '/',
        httpOnly: false,
        secure: true,
      },
    ]);
  } catch (error) {
    console.error('Error during authentication:', error);
  }
  await page.goto('/buecher/neu');

  await page.getByLabel('Titel', { exact: true }).fill('E2E Test Buch');
  await page
    .getByLabel('Untertitel', { exact: true })
    .fill('Ein Buch erstellt durch einen E2E Test');
  await page.getByLabel('ISBN').fill(isbn);
  await page.getByLabel('Preis').fill('29.99');
  await page.getByLabel('Rabatt').fill('0.1');
  await page.getByLabel('Rating').fill('4');
  await page.getByLabel('Art').selectOption('EPUB');
  await page.getByLabel('Lieferbar').check();
  await page.getByLabel('Datum').fill('2024-06-15');
  await page.getByLabel('Homepage').fill('https://example.com/e2e-test-buch');
  await page.getByLabel('Schlagwörter (kommagetrennt)').fill('E2E, Test, Buch');

  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    page.getByRole('button', { name: 'Buch erstellen' }).click(),
  ]);

  expect(dialog.message()).toBe('Buch erstellt ✅');
  await dialog.accept();

  const buchId = await page.request.get(`/rest?isbn=${searchisbn}`).then(async (response) => {
    const buecher = await response.json();
    return buecher.content[0].id;
  });
  await page.request.delete(`/rest/${buchId}`, {
    headers: {
      Authorization: `Bearer ${(await page.context().cookies()).find((cookie) => cookie.name === 'token')?.value}`,
    },
  });
});
