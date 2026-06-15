import { test, expect } from '@playwright/test';

test('Użytkownik może dodać recenzję do książki', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email or phone number' }).click();
  await page.getByRole('textbox', { name: 'Email or phone number' }).fill('user1@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('qwerty');
  await page.getByRole('checkbox', { name: 'Remember me' }).check();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'user1@gmail.com' }).click();
  await page.getByRole('link', { name: 'Wyrok' }).click();
  await page.getByRole('button', { name: '☆' }).nth(5).click();
  await page.getByRole('button', { name: 'Add review' }).click();
  await page
    .getByRole('textbox', { name: 'Write your review of this' })
    .click();
  await page
    .getByRole('textbox', { name: 'Write your review of this' })
    .fill('Bardzo dobra książką, jedna z najlepszych jakie czytałem!');
  await page.getByRole('button', { name: 'Save review' }).click();
  await expect(
    page.getByText('Bardzo dobra książką, jedna z najlepszych jakie czytałem!'),
  ).toBeVisible();
});
