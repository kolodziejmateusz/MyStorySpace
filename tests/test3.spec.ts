import { test } from '@playwright/test';

test('Użytkownik może otrzymać rekomendacje książek od AI', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email or phone number' }).click();
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill('user1@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('qwerty');
  await page.getByRole('checkbox', { name: 'Remember me' }).check();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'user1@gmail.com' }).click();
  await page.getByRole('button', { name: '🤖 Recommend books with AI' }).click();
  await page.locator('div').filter({ hasText: 'It Stephen King' }).click();
  await page.locator('div').filter({ hasText: 'The Shining Stephen King' }).click();
  await page.getByRole('button', { name: 'Wyślij do AI' }).click();
  await page.getByRole('button', { name: 'Pobierz rekomendacje' }).click();
  await page.getByRole('link', { name: 'Pet Sematary' }).click();
  await page.goto('http://localhost:3000/books/OL81631W');
  await page.getByRole('button', { name: 'Your books' }).click();
  await page.getByRole('button', { name: 'To Read' }).click();
});