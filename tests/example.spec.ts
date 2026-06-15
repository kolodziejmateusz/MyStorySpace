import { test } from '@playwright/test';

test('użytkownik może zalogować się do systemu i dodać książke do innej listy', async ({
  page,
}) => {
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
  await page.getByRole('button', { name: 'Your books' }).click();
  await page.getByRole('button', { name: 'Reading' }).click();
});

// test('użytkownik może zalogować się do systemu i dodać książkę do innej listy 2', async ({ page }) => {
//   await page.goto('http://localhost:3000/');

//   // demonstracyjne zatrzymanie odzwierciedlające czas wykonania pełnego scenariusza
//   await page.waitForTimeout(8000);
// });

test('testt', async ({ page }) => {
  await page.goto('https://www.ideis.pl/krakow/');
  await page.getByRole('button', { name: 'Akceptuję politykę plików' }).click();
  await page
    .getByLabel('Główne menu')
    .getByRole('link', { name: 'Strefa studenta' })
    .click();
  await page
    .getByRole('link', { name: 'Konto Kandydata', exact: true })
    .click();
  await page.goto('https://www.ideis.pl/krakow/');
  // await page.getByRole('button', { name: 'Akceptuję politykę plików' }).click();
  await page
    .getByLabel('Główne menu')
    .getByRole('link', { name: 'Strefa studenta' })
    .click();
  await page
    .getByRole('link', { name: 'Konto Kandydata', exact: true })
    .click();
  await page.goto('https://www.ideis.pl/krakow/');
  // await page.getByRole('button', { name: 'Akceptuję politykę plików' }).click();
  await page
    .getByLabel('Główne menu')
    .getByRole('link', { name: 'Strefa studenta' })
    .click();
  await page
    .getByRole('link', { name: 'Konto Kandydata', exact: true })
    .click();
  // await page.getByRole('link', { name: 'Zarejestruj się' }).click();
  // await page.getByRole('link', { name: 'Zaloguj się' }).nth(1).click();
  // await page.getByRole('link', { name: 'Zapomniałem hasła' }).click();
});
