import { test, expect } from '@playwright/test';

test('Detailsseite eines Buchs lädt korrekt', async ({ page }) => {
  await page.goto('/buecher/1');

  const notFoundText = page.getByText(
    'Die Seite, die du suchst, existiert nicht oder wurde verschoben.',
  );
  await expect(notFoundText).toHaveCount(0);

  await expect(page.getByText('Preis')).toBeVisible();
  await expect(page.getByText('ISBN')).toBeVisible();

  const backButton = page.getByRole('button', { name: /Zurück/i });
  await expect(backButton).toBeVisible();

  await backButton.click();
  await expect(page).toHaveURL(/\/buecher$/);
  await expect(page.getByText('Verfügbare Bücher')).toBeVisible();
});
