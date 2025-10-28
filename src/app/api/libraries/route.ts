import { Library } from 'lucide-react';
import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

type Library = {
  name: string;
  street: string;
  postal: string;
  booksCount: string;
  checkLink: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const lat = parseFloat(url.searchParams.get('lat') || '50.0614');
  const lng = parseFloat(url.searchParams.get('lng') || '19.9383');
  const browser = await chromium.launch();

  const context = await browser.newContext({
    geolocation: { latitude: lat, longitude: lng },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();

  await page.goto('https://xn--szukamksiki-4kb16m.pl/SkNewWeb/start', {
    waitUntil: 'domcontentloaded',
  });
  await page.getByRole('textbox', { name: 'Tytuł:' }).click();
  await page
    .getByRole('textbox', { name: 'Tytuł:' })
    .fill(query || 'Harry Potter i Komnata Tajemnic');
  await page.getByRole('textbox', { name: 'Tytuł:' }).press('Enter');
  await page.getByRole('radio', { name: '40' }).check();

  // Czekaj na wyniki
  await page.waitForSelector(
    'a[data-toggle="collapse"][aria-controls^="biblioteki_"]',
  );

  // Znajdź wszystkie strzałki i kliknij je po kolei
  const arrows = await page.locator(
    'a[data-toggle="collapse"][aria-controls^="biblioteki_"]',
  );
  const count = await arrows.count();
  for (let i = 0; i < count; i++) {
    await arrows.nth(i).click();
  }

  const libraries: Library[] = await page.$$eval('div.row.even', (rows) =>
    rows.map((row) => {
      const nameLink = row.querySelector('p.adres-bib a');
      const streetLink = row.querySelector(
        'p.adres-bib small a:nth-of-type(1)',
      );
      const postalLink = row.querySelector(
        'p.adres-bib small:nth-of-type(2) a',
      );
      const booksCountDiv = row.querySelector(
        'div.col-2.my-auto div.row:nth-child(2) div.col-auto',
      );
      const checkLinkAnchor = row.querySelector(
        'div.col-2.my-auto a.btn-primary',
      );

      return {
        name: nameLink?.textContent?.trim() ?? '',
        street: streetLink?.textContent?.trim() ?? '',
        postal: postalLink?.textContent?.trim() ?? '',
        booksCount: booksCountDiv?.textContent?.trim() ?? '',
        checkLink: (checkLinkAnchor as HTMLAnchorElement)?.href ?? '',
      };
    }),
  );

  await browser.close();

  const librariesWithId = libraries.map((library, index) => ({
    id: index + 1,
    query,
    ...library,
  }));

  return NextResponse.json(librariesWithId, { status: 200 });
}
