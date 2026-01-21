---
description: Z tej strony dowiesz się jak działa endpoint `/api/libraries`
---

# GET `/api/libraries`

## GET `/api/libraries` - Wyszukiwanie bibliotek i dostępności książek

### Opis endpointa

Endpoint wyszukuje biblioteki publiczne w pobliżu podanej lokalizacji geograficznej, które posiadają konkretną książkę. Wykorzystuje web scraping serwisu "Szukam książki" (szukamksiki.pl) do pobrania listy bibliotek z informacją o dostępności kopii. Zwraca listę bibliotek posortowaną według lokalizacji użytkownika.

### Pobierane parametry

Endpoint przyjmuje trzy parametry query, z których jeden jest wymagany:

| Parametr | Typ    | Wymagany | Opis                                                           |
| -------- | ------ | -------- | -------------------------------------------------------------- |
| `q`      | string | ✅ Tak   | Tekst zapytania wyszukiwania (np. nazwa książki, tytuł, autor) |
| `lat`    | number | ❌ Nie   | Szerokość geograficzna (domyślnie 50.0614 - Kraków)            |
| `lng`    | number | ❌ Nie   | Długość geograficzna (domyślnie 19.9383 - Kraków)              |

#### Przykłady zapytań:

- `/api/libraries?q=Harry+Potter+i+Komnata+Tajemnic&lat=49.5949&lng=19.9732`
- `/api/libraries?q=Wiedźmin&lat=52.2297&lng=21.0122`
- `/api/libraries?q=Stephen+King`

### Zwracane dane

Endpoint zwraca obiekt JSON zawierający zapytanie wyszukiwania, współrzędne lokalizacji oraz tablicę bibliotek z informacją o dostępności książek.

#### Schemat odpowiedzi (200 OK)

```json
{
  "query": "string",
  "latitude": "number",
  "longitude": "number",
  "libraries": [
    {
      "id": "number",
      "name": "string",
      "address": {
        "street": "string",
        "postalCode": "string"
      },
      "availableBooks": "number",
      "totalBooks": "number",
      "checkLink": "string"
    }
  ]
}
```

#### Opisy pól:

| Pole             | Typ    | Opis                                                              |
| ---------------- | ------ | ----------------------------------------------------------------- |
| `query`          | string | Zapytanie wyszukiwania użyte w żądaniu                            |
| `latitude`       | number | Szerokość geograficzna używana do wyszukiwania                    |
| `longitude`      | number | Długość geograficzna używana do wyszukiwania                      |
| `libraries`      | array  | Tablica bibliotek z informacją o dostępności książek              |
| `id`             | number | Unikalne ID biblioteki (liczba porządkowa)                        |
| `name`           | string | Pełna nazwa biblioteki                                            |
| `address`        | object | Obiekt zawierający dane adresowe biblioteki                       |
| `street`         | string | Ulica i numer domu biblioteki                                     |
| `postalCode`     | string | Kod pocztowy i miejscowość                                        |
| `availableBooks` | number | Liczba dostępnych kopii książki w bibliotece                      |
| `totalBooks`     | number | Łączna liczba kopii książki w bibliotece (dostępne + wypożyczone) |
| `checkLink`      | string | Link do szczegółów egzemplarza na szukamksiki.pl                  |

#### Przykładowa odpowiedź:

```json
{
  "query": "Harry Potter i Komnata Tajemnic",
  "latitude": 49.5949,
  "longitude": 19.9732,
  "libraries": [
    {
      "id": 1,
      "name": "Gminny Ośrodek Kultury, Sportu i Promocji w Jordanowie. Biblioteka Łętownia",
      "address": {
        "street": "Łętownia 348",
        "postalCode": "34-242 Łętownia"
      },
      "availableBooks": 2,
      "totalBooks": 2,
      "checkLink": "https://xn--szukamksiki-4kb16m.pl/SkNewWeb/record/1132/872880"
    },
    {
      "id": 2,
      "name": "Gminny Ośrodek Kultury, Sportu i Promocji w Jordanowie. Biblioteka Łętownia",
      "address": {
        "street": "Łętownia 348",
        "postalCode": "34-242 Łętownia"
      },
      "availableBooks": 0,
      "totalBooks": 1,
      "checkLink": "https://xn--szukamksiki-4kb16m.pl/SkNewWeb/record/1132/1363177"
    },
    {
      "id": 3,
      "name": "Gminna Biblioteka Publiczna w Mszanie Dolnej Filia w Rabie Niżnej",
      "address": {
        "street": "Raba Niżna 252",
        "postalCode": "34-730 Raba Niżna"
      },
      "availableBooks": 1,
      "totalBooks": 1,
      "checkLink": "https://xn--szukamksiki-4kb16m.pl/SkNewWeb/record/1534/4445091"
    }
  ]
}
```

### Proces pobierania danych

Endpoint wykonuje następujące kroki w celu zgromadzenia informacji o dostępności książek w bibliotekach:

1. **Parsowanie parametrów** - Pobiera zapytanie (q) oraz współrzędne GPS (lat, lng) z URL
2. **Uruchomienie przeglądarki Playwright** - Inicjalizuje instancję chromium
3. **Konfiguracja lokalizacji** - Ustawia geolokalizację przeglądarki na podane współrzędne
4. **Nawigacja do szukamksiki.pl** - Przechodzi do portalu "Szukam książki"
5. **Wyszukiwanie książki** - Wpisuje zapytanie w pole "Tytuł" i potwierdza wyszukiwaniem
6. **Ustawienie zakresu wyników** - Zmienia filtr na wyświetlanie 40 wyników na stronie
7. **Rozwijanie bibliotek** - Klika wszystkie przyciski rozwijania sekcji bibliotek
8. **Ekstrahowanie danych** - Pobiera informacje o każdej bibliotece (nazwa, adres, dostępność)
9. **Parsowanie liczb** - Konwertuje format "X z Y" na liczby dostępnych i całkowitych kopii
10. **Zamknięcie przeglądarki** - Zamyka instancję chromium
11. **Zwrot danych** - Zwraca listę bibliotek z numerami porządkowymi

### Kody odpowiedzi HTTP

| Kod   | Opis                                        | Schemat błędu                                |
| ----- | ------------------------------------------- | -------------------------------------------- |
| `200` | Sukces - lista bibliotek zwrócona poprawnie | `{ "query": "...", "libraries": [...] }`     |
| `400` | Brak wymaganego parametru `q`               | `{ "error": "Query parameter is required" }` |
| `500` | Błąd serwera - web scraping się nie powiódł | `{ "error": "Failed to fetch libraries" }`   |

### Obsługa błędów i szczególne przypadki

- **Brakujące dane adresowe** - Jeśli element adresu nie zostanie znaleziony, zwracany jest pusty string
- **Brakujące liczby kopii** - Jeśli format liczby będzie inny, wartości domyślne to 0
- **Brakujący link** - Jeśli link do szczegółów nie będzie dostępny, zwracany jest pusty string
- **Brak wyników** - Tablica `libraries` może być pusta, jeśli nie znaleziono żadnych bibliotek posiadających książkę
- **Duplikaty** - Ta sama biblioteka może pojawić się wiele razy, jeśli posiada wiele kopii tej samej książki w różnych stanach
- **Domyślna lokalizacja** - Jeśli parametry lat/lng nie zostaną podane, endpoint domyślnie wyszukuje dla Krakowa

### Notatki implementacyjne

- Endpoint korzysta z **Playwright** do automatyzacji testów i web scrapingu
- Obsługuje geolokalizację przeglądarki za pomocą API Playwright (`browser.newContext()`)
- Selektor CSS `div.row.even` pobiera wszystkie wiersze bibliotek
- Każdy wierszy posiada rozwijane sekcje, które muszą być klikane automatycznie
- Dostępność kopii jest parsowana z formatu "X z Y" za pomocą split(" z ")
- Endpoint zwraca dane w kolejności, w jakiej pojawią się na stronie (zazwyczaj posortowane po odległości)
- Używany jest Next.js API Routes (`/api/libraries/route.ts`)
- Parametry `lat` i `lng` mogą być dostarczone jako liczby zmiennoprzecinkowe
- Implementacja czeka na załadowanie elementów za pomocą `waitForSelector()`
- Geolokalizacja jest symulowana na poziomie przeglądarki, a serwis zwraca biblioteki "w pobliżu" podanego punktu
