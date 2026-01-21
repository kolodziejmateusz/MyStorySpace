---
description: Z tej strony dowiesz się jak działa endpoint `/api/recommend`
---

# POST `/api/recommend`

## POST `/api/recommend` - Generowanie rekomendacji książek za pomocą AI

### Opis endpointa

Endpoint generuje spersonalizowane rekomendacje książek na podstawie listy książek przeczytanych przez użytkownika. Wykorzystuje Google Gemini AI do analizy preferencji czytelnika i sugeruje 5 książek, które mogą mu się spodobać. Następnie pobiera szczegółowe informacje o każdej rekomendowanej książce z bazy Open Library.

### Pobierane parametry

Endpoint przyjmuje jedno wymagane pole w ciele żądania (request body):

| Parametr | Typ              | Wymagany | Opis                                                                |
| -------- | ---------------- | -------- | ------------------------------------------------------------------- |
| `books`  | array of objects | ✅ Tak   | Tablica obiektów zawierających tytuł i autora przeczytanych książek |
| `title`  | string           | ✅ Tak   | Tytuł przeczytanej książki                                          |
| `author` | string           | ✅ Tak   | Imię i nazwisko autora przeczytanej książki                         |

#### Przykład żądania:

```json
{
  "books": [
    {
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J. K. Rowling"
    },
    {
      "title": "The Lord of the Rings",
      "author": "J. R. R. Tolkien"
    },
    {
      "title": "Wiedźmin: Ostatnie życzenie",
      "author": "Andrzej Sapkowski"
    }
  ]
}
```

### Zwracane dane

Endpoint zwraca obiekt JSON zawierający rekomendacje AI oraz szczegółowe informacje o poleconych książkach pobranych z Open Library.

#### Schemat odpowiedzi (200 OK)

```json
{
  "recommendations": [
    {
      "title": "string",
      "author": "string"
    },
    {
      "title": "string",
      "author": "string"
    }
  ],
  "books": [
    {
      "id": "string",
      "title": "string",
      "authors": ["string"],
      "publishedDate": "string",
      "averageRating": "number | null",
      "categories": ["string"],
      "description": "string",
      "thumbnail": "string"
    },
    {
      "id": "string",
      "title": "string",
      "authors": ["string"],
      "publishedDate": "string",
      "averageRating": "number | null",
      "categories": ["string"],
      "description": "string",
      "thumbnail": "string"
    }
  ]
}
```

#### Opisy pól:

| Pole              | Typ            | Opis                                                                     |
| ----------------- | -------------- | ------------------------------------------------------------------------ |
| `recommendations` | array          | Tablica rekomendacji zwróconych przez AI (zawsze 5 książek)              |
| `title`           | string         | Tytuł rekomendowanej książki z AI                                        |
| `author`          | string         | Autor rekomendowanej książki z AI                                        |
| `books`           | array          | Tablica szczegółowych informacji o znalezionych książkach z Open Library |
| `id`              | string         | Unikalne ID z Open Library                                               |
| `title`           | string         | Tytuł książki znalezionej w Open Library                                 |
| `authors`         | string[]       | Tablica autorów wyekstrahowana z Open Library                            |
| `publishedDate`   | string         | Data publikacji książki                                                  |
| `averageRating`   | number \| null | Średnia ocena z Open Library (lub `null` jeśli niedostępna)              |
| `categories`      | string[]       | Tablica kategorii/gatunków książki                                       |
| `description`     | string         | Opis książki                                                             |
| `thumbnail`       | string         | URL do okładki książki                                                   |

#### Przykładowa odpowiedź:

```json
{
  "recommendations": [
    {
      "title": "The Name of the Wind",
      "author": "Patrick Rothfuss"
    },
    {
      "title": "A Court of Thorns and Roses",
      "author": "Sarah J. Maas"
    },
    {
      "title": "Magician",
      "author": "Raymond E. Feist"
    },
    {
      "title": "The Poppy War",
      "author": "R. F. Kuang"
    },
    {
      "title": "Six of Crows",
      "author": "Leigh Bardugo"
    }
  ],
  "books": [
    {
      "id": "OL45883W",
      "title": "The Name of the Wind",
      "authors": ["Patrick Rothfuss"],
      "publishedDate": "2007",
      "averageRating": 4.55,
      "categories": ["Fantasy", "Fiction", "Magic"],
      "description": "Kvothe is imprisoned in this present day...",
      "thumbnail": "https://covers.openlibrary.org/b/id/8235688-M.jpg"
    },
    {
      "id": "OL27448W",
      "title": "A Court of Thorns and Roses",
      "authors": ["Sarah J. Maas"],
      "publishedDate": "2015",
      "averageRating": 4.65,
      "categories": ["Fantasy", "Romance", "Young Adult"],
      "description": "A human girl wandering in the woods at night is dragged away...",
      "thumbnail": "https://covers.openlibrary.org/b/id/8241375-M.jpg"
    }
  ]
}
```

### Proces pobierania danych i generowania rekomendacji

Endpoint wykonuje następujące kroki w celu dostarczenia rekomendacji:

1. **Walidacja danych wejściowych** - Sprawdza czy parametr `books` jest tablicą obiektów z polami `title` i `author`
2. **Przygotowanie promptu** - Konwertuje listę przeczytanych książek na format tekstowy
3. **Inicjalizacja modelu AI** - Uruchamia model Google Gemini 2.5 Flash
4. **Wysłanie żądania do AI** - Wysyła do modelu prompt z instrukcjami i listą przeczytanych książek
5. **Parsowanie odpowiedzi AI** - Ekstrahuje rekomendacje z odpowiedzi JSON od AI
6. **Walidacja rekomendacji** - Sprawdza czy każda rekomendacja zawiera pola `title` i `author`
7. **Pobieranie szczegółów** - Dla każdej rekomendacji wysyła zapytanie do `/api/books` aby uzyskać szczegóły z Open Library
8. **Filtrowanie wyników** - Usuwa rekomendacje, dla których nie znaleziono szczegółów w Open Library
9. **Zwrot danych** - Zwraca zarówno listę rekomendacji AI jak i szczegóły znalezionych książek

### Kody odpowiedzi HTTP

| Kod   | Opis                                                                       | Schemat błędu                                                          |
| ----- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `200` | Sukces - rekomendacje wygenerowane i szczegóły pobrane                     | `{ "recommendations": [...], "books": [...] }`                         |
| `400` | Brak wymaganego parametru `books` lub zły format                           | `{ "error": "Invalid book list" }`                                     |
| `500` | Błąd serwera - nie udało się wygenerować rekomendacji lub pobrać szczegóły | `{ "error": "Failed to generate recommendations. Please try again." }` |

### Obsługa błędów i szczególne przypadki

- **Brakujące szczegóły książek** - Jeśli książka AI nie zostanie znaleziona w Open Library, zostanie pominięta z tablicy `books`
- **Błąd parsowania odpowiedzi AI** - Jeśli AI zwróci nie-JSON, endpoint próbuje wyekstrahować dane za pomocą regex
- **Pusta tablica wejściowa** - Jeśli tablica `books` jest pusta, endpoint zwraca błąd 400
- **Brak połączenia z Open Library** - Jeśli pobieranie szczegółów nie powiedzie się, zwracane są tylko rekomendacje AI
- **Nieprawidłowe dane autorów/tytułów** - Dane są filtrowane i walidowane, puste elementy są ignorowane
- **Limit tokenów AI** - Maksymalnie 1024 tokeny wyjściowe dla każdego żądania

### Notatki implementacyjne

- Endpoint korzysta z **Google Generative AI SDK** z modelem `gemini-2.5-flash`
- Wymusza odpowiedź w formacie JSON za pomocą `responseMimeType: 'application/json'`
- Temperatura modelu AI ustawiona na 0.7 dla zbalansowanej kreatywności i konsekwencji
- Każda rekomendacja jest wyszukiwana w Open Library za pomocą zapytania "title author"
- Zwracane są tylko książki, które zostały znalezione w Open Library (pozostałe są filtrowane)
- Endpoint obsługuje fallback: jeśli JSON parser nie powiedzie się, próbuje wyekstrahować dane regex'em
- Używane są Next.js API Routes (`/api/recommend/route.ts`) z metodą POST
- Parametr `NEXT_PUBLIC_GEMINI_API_KEY` musi być ustawiony w zmiennych środowiskowych
- SYSTEM_PROMPT instruuje AI aby zawsze zwracało dokładnie 5 rekomendacji
- Każde żądanie do `/api/books` jest niezależne i paralelizowane za pomocą `Promise.all()`

### Limity i ograniczenia

- AI zawsze zwraca dokładnie **5 rekomendacji** (chyba że nie uda się parsować odpowiedzi)
- Maksymalna ilość wejściowych książek: brak limitu, ale za dużo może wpłynąć na czas odpowiedzi
- Timeout dla każdego żądania do Open Library: domyślny timeout przeglądarki
- Temperatura generacji AI: 0.7 (może być zmieniana w konfiguracji)
- Maksymalny czas odpowiedzi: zależy od szybkości API Google Gemini i Open Library
