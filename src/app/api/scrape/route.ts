// app/api/scrape/route.ts

import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

type Bookstore = {
  name: string;
  type: string;
  price: string;
  link: string;
};

export async function GET() {
  // Uruchomienie przeglądarki
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wejście na stronę książki
  await page.goto(
    'https://lubimyczytac.pl/ksiazka/5201943/harry-potter-i-kamien-filozoficzny',
    { waitUntil: 'domcontentloaded' },
  );
  await page.locator('.placeholder_overlay').click();

  // Selektor sekcji polecanych księgarni
  const bookstoreSelector = '#buybox-bookstores-promoted .bookstore';

  // Wyciągnięcie danych do tablicy obiektów
  await page.waitForSelector(bookstoreSelector);

  const bookstores: Bookstore[] = await page.$$eval(
    bookstoreSelector,
    (elements) => {
      return elements.map((el) => {
        const name =
          el.querySelector('.bookstore-name')?.textContent?.trim() || '';
        const type =
          el.querySelector('.bookstore-item-kind')?.textContent?.trim() || '';
        const price =
          el.querySelector('.bookstore-item-price')?.textContent?.trim() || '';
        const link = el.querySelector('a')?.href || '';
        return { name, type, price, link };
      });
    },
  );
  await browser.close();

  // Zwrócenie danych w formacie JSON
  console.log(bookstores);
  return NextResponse.json(bookstores, { status: 200 });
}
