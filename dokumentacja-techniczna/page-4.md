---
description: Z tej strony dowiesz się jak działa endpoint `/api/bookstores`
---

# GET `/api/bookstores`

## GET `/api/bookstores` - Wyszukiwanie ksiągarni i cen książek

### Opis endpointa

Endpoint wyszukuje ceny książek w różnych polskich ksiągarniach internetowych na podstawie podanego zapytania (query). Wykorzystuje web scraping serwisu Lubimyczytać.pl do pobrania listy dostępnych punktów sprzedaży z cenami. Zwraca listę ksiągarni posortowaną rosnąco po cenie.

### Pobierane parametry

Endpoint przyjmuje jeden wymagany parametr query:

| Parametr | Typ    | Wymagany | Opis                                                           |
| -------- | ------ | -------- | -------------------------------------------------------------- |
| `q`      | string | ✅ Tak   | Tekst zapytania wyszukiwania (np. nazwa książki, tytuł, autor) |

#### Przykłady zapytań:

- `/api/bookstores?q=Harry+Potter+i+Komnata+Tajemnic`
- `/api/bookstores?q=Wiedźmin`
- `/api/bookstores?q=Stephen+King`

### Zwracane dane

Endpoint zwraca obiekt JSON zawierający zapytanie wyszukiwania oraz tablicę ksiągarni z dostępnymi cenami.

#### Schemat odpowiedzi (200 OK)

```json
{
  "query": "string",
  "bookstores": [
    {
      "id": "number",
      "name": "string",
      "type": "string",
      "price": "number",
      "img": "string",
      "link": "string"
    },
    {
      "id": "number",
      "name": "string",
      "type": "string",
      "price": "number",
      "img": "string",
      "link": "string"
    }
  ]
}
```

#### Opisy pól:

| Pole         | Typ    | Opis                                                             |
| ------------ | ------ | ---------------------------------------------------------------- |
| `query`      | string | Zapytanie wyszukiwania użyte w żądaniu                           |
| `bookstores` | array  | Tablica ksiągarni z dostępnymi cenami                            |
| `id`         | number | Unikalne ID ksiągarni (liczba porządkowa)                        |
| `name`       | string | Nazwa ksiągarni (np. "Amazon", "Allegro", "dadada.pl")           |
| `type`       | string | Typ produktu (np. "książka", "ebook", "audiobook")               |
| `price`      | number | Cena książki w złotych (PLN) - liczba zmiennoprzecinkowa         |
| `img`        | string | URL do logo/ikony ksiągarni                                      |
| `link`       | string | Link do produktu na Lubimyczytać.pl (przekierowuje do ksiągarni) |

#### Przykładowa odpowiedź:

```json
{
  "query": "Harry Potter i Komnata Tajemnic",
  "bookstores": [
    {
      "id": 1,
      "name": "Amazon",
      "type": "książka",
      "price": 16.86,
      "img": "https://assets.buybox.click/af4d82f4412138cd2669c4a044be75acb1b3d001.png",
      "link": "https://lubimyczytac.pl/shop/go?url=aHR0cHM6Ly9nby5idXlib3guY2xpY2svYmJjbGlja18xNzkyOV8xNjAzOTU1Njg/cDE9d2ViX2Rlc2t0b3AmcDI9NTE4NjQ3OC4wLiZwMz1ib29rLmRldGFpbHMubWFpbi5saXN0LnJlZ3VsYXI="
    },
    {
      "id": 2,
      "name": "dadada.pl",
      "type": "książka",
      "price": 21.45,
      "img": "https://assets.buybox.click/62e15063dc0c1ee92f64f6a0d9617f81bec99618.png",
      "link": "https://lubimyczytac.pl/shop/go?url=aHR0cHM6Ly9nby5idXlib3guY2xpY2svYmJjbGlja18xNzkyOV8xMzcwMTYyND9wMT13ZWJfZGVza3RvcCZwMj01MTg2NDc4LjAuJnAzPWJvb2suZGV0YWlscy5tYWluLmxpc3QucmVndWxhcg=="
    },
    {
      "id": 3,
      "name": "Allegro",
      "type": "książka",
      "price": 23.37,
      "img": "https://assets.buybox.click/5cfed0a4601013ee129d8e0d55efd3a2975f74d9.png",
      "link": "https://lubimyczytac.pl/shop/go?url=aHR0cHM6Ly9nby5idXlib3guY2xpY2svYmJjbGlja18xNzkyOV8xOTgwNjA1NDk/cDE9d2ViX2Rlc2t0b3AmcDI9NTE4NjQ3OC4wLiZwMz1ib29rLmRldGFpbHMubWFpbi5saXN0LnJlZ3VsYXI="
    }
  ]
}
```

### Proces pobierania danych

Endpoint wykonuje następujące kroki w celu zgromadzenia informacji o dostępnych ksiągarniach:

1. **Otwarcie przeglądarki Playwright** - Uruchamia instancję chromium do automatyzacji
2. **Nawigacja do Lubimyczytać.pl** - Przechodzi do głównej strony serwisu
3. **Wyszukiwanie książki** - Wpisuje zapytanie w pole wyszukiwania i klika przycisk szukania
4. **Przechodzenie do szczegółów** - Klikuje na pierwszą znalezioną książkę
5. **Pobieranie danych ksiągarni** - Ekstrahuje informacje z sekcji "Kup książkę" (zarówno promocyjne jak i zwykłe)
6. **Sortowanie po cenie** - Sortuje ksiągarnie rosnąco po cenie
7. **Zamknięcie przeglądarki** - Zamyka instancję chromium
8. **Zwrot danych** - Zwraca posortowaną listę z numerami porządkowymi

### Kody odpowiedzi HTTP

| Kod   | Opis                                        | Schemat błędu                                |
| ----- | ------------------------------------------- | -------------------------------------------- |
| `200` | Sukces - lista ksiągarni zwrócona poprawnie | `{ "query": "...", "bookstores": [...] }`    |
| `400` | Brak wymaganego parametru `q`               | `{ "error": "Query parameter is required" }` |
| `500` | Błąd serwera - web scraping się nie powiódł | `{ "error": "Failed to fetch bookstores" }`  |

### Obsługa błędów i szczególne przypadki

- **Brakujące logo ksiągarni** - Jeśli element logotypu nie zostanie znaleziony, zwracany jest pusty string
- **Brakujący typ produktu** - Jeśli typ nie będzie dostępny, pole zawiera pusty string
- **Błędy parsowania ceny** - Cena jest konwertowana z formatu "XX,XX zł" na liczbę zmiennoprzecinkową
- **Brakujący link** - Jeśli link nie będzie dostępny, zwracany jest pusty string
- **Brak wyników** - Tablica `bookstores` może być pusta, jeśli nie znaleziono żadnych ksiągarni

### Notatki implementacyjne

- Endpoint korzysta z **Playwright** do automatyzacji testów i web scrapingu
- Obsługuje dwa selektory CSS dla ksiągarni: promocyjne i zwykłe
- Dane są pobierane dynamicznie za pomocą `page.$$eval()`
- Ceny są parsowane poprzez usunięcie znaku waluty "zł" i zastąpienie przecinka kropką
- Endpoint zwraca dane posortowane rosnąco po cenie (najtańsze na początek)
- Używany jest Next.js API Routes (`/api/bookstores/route.ts`)
- Parametr `q` może zawierać spacje (kodowane jako `+` w URL)
- Implementacja czeka na załadowanie elementów za pomocą `waitForSelector()`
