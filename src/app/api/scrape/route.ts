import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

type Bookstore = {
  name: string;
  type: string;
  price: number;
  img: string;
  link: string;
};

export async function GET() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://lubimyczytac.pl/ksiazka/5208216/jeszcze-kiedys-zatancze-w-deszczu',
    { waitUntil: 'domcontentloaded' },
  );
  await page.locator('.placeholder_overlay').click();

  const selectors = [
    '#buybox-bookstores-promoted .bookstore',
    '#buybox-bookstores .bookstore',
  ];

  let combinedBookstores: Bookstore[] = [];

  for (const selector of selectors) {
    await page.waitForSelector(selector);
    const bookstores: Bookstore[] = await page.$$eval(selector, (elements) => {
      return elements.map((el) => {
        const nameElement = el.querySelector('.bookstore-name');
        const name = nameElement?.textContent?.trim() || '';
        const img =
          nameElement?.querySelector('img')?.getAttribute('src') || '';
        const type =
          el.querySelector('.bookstore-item-kind')?.textContent?.trim() || '';
        const priceString =
          el.querySelector('.bookstore-item-price')?.textContent?.trim() || '';
        const numericString = priceString
          .replace('zł', '')
          .trim()
          .replace(',', '.');
        const price = parseFloat(numericString);

        const link = (el as HTMLAnchorElement).href || '';
        return { name, type, price, img, link };
      });
    });
    combinedBookstores = combinedBookstores.concat(bookstores);
  }

  await browser.close();

  const sortedCombinedBookstores = combinedBookstores.sort(
    (a, b) => a.price - b.price,
  );

  const sortedCombinedBookstoresWithId = sortedCombinedBookstores.map(
    (bookstore, index) => ({
      id: index + 1,
      ...bookstore,
    }),
  );
  return NextResponse.json(sortedCombinedBookstoresWithId, { status: 200 });
}
