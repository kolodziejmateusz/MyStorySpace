// app/api/scrape/route.ts

import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET() {
  // Uruchomienie przeglądarki
  const browser = await chromium.launch();
  const page = await browser.newPage();

  //   await page.goto('https://example.com');
  await page.goto('https://www.warmane.com/');
  await page.getByRole('link', { name: 'CHANGELOG' }).click();
  await page
    .locator('#changelogDate_msdd > .wm-ui-dropdown-title > .arrow')
    .click();
  await page.locator('#changelogDate_child').getByText('March 2025').click();
  const lastElement = await page.getByText('Fixed not auto-learning');
  const text = await lastElement.textContent();

  await browser.close();

  // Zwrócenie danych w formacie JSON
  return NextResponse.json({ headers: text });
}

// import { NextResponse } from 'next/server';
// import { chromium } from 'playwright';

// export async function GET() {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();

//   try {
//     await page.goto('https://www.warmane.com/');
//     await page.getByRole('link', { name: 'CHANGELOG' }).click();
//     await page.locator('#changelogDate_msdd > .wm-ui-dropdown-title > .arrow').click();
//     await page.locator('#changelogDate_child').getByText('March 2025').click();
//     const lastElement = await page.getByText('Fixed not auto-learning');

//     const text = await lastElement.textContent();

//     await browser.close();

//     return NextResponse.json({ tekst: text?.trim() || '' });
//   } catch (error) {
//     await browser.close();
//     return NextResponse.json({ error: 'Błąd podczas pobierania danych', details: error.message }, { status: 500 });
//   }
// }
