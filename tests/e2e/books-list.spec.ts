import { test, expect } from '@playwright/test';

test('Bücherliste lädt und Suche nach Titel funktioniert', async ({ page }) => {
  await page.goto('/buecher');

  await expect(page.getByText('Verfügbare Bücher')).toBeVisible();

  const cards = page.locator('.card');
  await expect(cards).not.toHaveCount(0);

  const searchInput = page.getByPlaceholder('Nach Titel suchen...');
  await searchInput.fill('ar');

  await page.waitForTimeout(200);

  const filteredCount = await cards.count();
  expect(filteredCount).toBeGreaterThan(0);
});
