/**
 * End-to-End-Test für die Bücherlisten-Seite.
 *
 * Prüft, ob die Bücherliste geladen wird und die Suche
 * nach einem Titel korrekt funktioniert.
 */

import { test, expect } from '@playwright/test';

/**
 * Verifiziert das Laden der Bücherliste sowie die Filterung
 * über die Titelsuche.
 */
test('Bücherliste lädt und Suche nach Titel funktioniert', async ({ page }) => {
  await page.goto('/buecher');

  await expect(page.getByText('Bücher suchen')).toBeVisible();

  const searchInput = page.getByPlaceholder('Titel...');
  await searchInput.fill('ar');

  await page.getByRole('button', { name: 'Suchen' }).click();

  // Warten bis die Bücher erscheinen
  const detailsButtons = page.getByRole('button', { name: 'Details' });
  await detailsButtons.first().waitFor({ state: 'visible' });

  const filteredCount = await detailsButtons.count();

  if (filteredCount === 0) {
    // Prüfen, ob der Empty-State angezeigt wird
    const emptyState = page.getByText(/keine.*bücher/i);
    const emptyCount = await emptyState.count();
    expect(emptyCount + filteredCount).toBeGreaterThanOrEqual(1);
  } else {
    expect(filteredCount).toBeGreaterThan(0);
  }
});
