import { test } from '@playwright/test';

test('Użytkownik może wyszukać książkę i zarezerwować ją w bibliotece w okolicy', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Search books' }).click();
  await page.getByRole('textbox', { name: 'Search books' }).fill('Szymek');
  await page.getByRole('textbox', { name: 'Search books' }).press('Enter');
  await page.getByRole('link', { name: 'Szymek', exact: true }).click();
  await page.getByRole('button', { name: 'Check' }).first().click();
  await page.getByRole('button', { name: 'zarezerwuj' }).click();
});